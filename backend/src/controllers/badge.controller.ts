import { NextFunction, Request, Response } from 'express';
import { Contract, Wallet, BigNumber } from 'ethers';
import { Network, Alchemy } from 'alchemy-sdk';
import { IBadgeCreatingInfo, IBagdeAssignInfo, IQueryPriceParams, IUser } from 'types';
import db from '../db.js';
import { isProduction, nftAbi, uploadsFolder, uploadsFolderTypes } from '../consts.js';
import { HttpCode, RequestBody, RequestBodyWithFile, RequestParams, RequestQuery, ResponseBody } from '../types.js';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { getRandomStr, parseBool } from '../utils.js';

interface IBadgeConfig {
  apiKey: string;
  walletKey: string;
  contractAddress: string;
  settings: { apiKey: string; network: Network };
}

const getBalanceOfBatch = async ({ address, config }: { address: string; config: IBadgeConfig }) => {
  const alchemy = new Alchemy(config.settings);
  const provider = await alchemy.config.getProvider();
  const signer = new Wallet(config.walletKey, provider);
  const contract = new Contract(config.contractAddress, JSON.parse(nftAbi), signer);
  const badgeCount = await contract.getTotalBadgeCount();

  const accounts = [];
  for (let i = 0; i < badgeCount.toNumber(); i++) accounts.push(address);

  const resultBalance: BigNumber[] = await contract.balanceOfBatch(
    accounts,
    accounts.map((i, key) => key + 1),
  );

  return resultBalance.reduce((badges, curr, key) => {
    const intCount: number = curr.toNumber();
    if (intCount) return { ...badges, [key + 1]: intCount };
    return badges;
  }, {} as Record<string, number>);
};

class BadgeController implements IBadgeConfig {
  apiKey = '';
  walletKey = '';
  contractAddress = '';
  settings = { apiKey: '', network: Network.MATIC_MUMBAI };

  constructor() {
    this.setWalletConfig = this.setWalletConfig.bind(this);
    this.createBadge = this.createBadge.bind(this);
    this.getMintPrice = this.getMintPrice.bind(this);
    this.getBadges = this.getBadges.bind(this);
    this.getBadge = this.getBadge.bind(this);
    this.assignBadge = this.assignBadge.bind(this);
  }

  setWalletConfig() {
    const apiKey = process.env.CONTRACT_API_KEY;
    const walletKey = process.env.WALLET_KEY;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (apiKey && walletKey && contractAddress) {
      this.apiKey = contractAddress;
      this.walletKey = walletKey;
      this.contractAddress = contractAddress;
      this.settings = { ...this.settings, apiKey };
    }
  }

  async createBadge(
    req: Request<RequestParams, ResponseBody, RequestBodyWithFile<IBadgeCreatingInfo>, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      this.setWalletConfig();
      const { username, filelink, userID, isReset, data, ...badgeData } = req.body;

      if (req.files && badgeData) {
        const file: fileUpload.UploadedFile = req.files.file as UploadedFile;
        const filename = getRandomStr(32) + file.name.slice(file.name.lastIndexOf('.'));
        const filepath = `${uploadsFolder}/${username}/${uploadsFolderTypes.badges}/${filename}`;

        const dataKeys = Object.keys(badgeData);
        const dataValues = Object.values(badgeData);

        file.mv(filepath, (err) => {
          err && console.log(err);
          // return res.status(500).json(err);
        });

        const imagePath = (isProduction ? '/' : `${req.protocol}://${req.headers.host}/`) + filepath;

        const newBadge = await db.query(
          `INSERT INTO badges (${dataKeys.map((key) => key)}, image) values (${dataKeys.map(
            (_, index) => `$${index + 1}`,
          )}, '${imagePath}') RETURNING *`,
          [...dataValues],
        );
        if (newBadge.rowCount) return res.status(HttpCode.CREATED).json(newBadge.rows[0]);
        return res.sendStatus(HttpCode.NOT_FOUND);
      }
      return res.sendStatus(HttpCode.BAD_REQUEST);
    } catch (error) {
      next(error);
    }
  }

  async getBadges(req: Request, res: Response, next: NextFunction) {
    try {
      this.setWalletConfig();
      const { address } = req.params;
      let contractBadges = null;

      const user = await db.query('SELECT id, roleplay FROM users WHERE wallet_address = $1', [address]);

      if (user.rowCount) {
        const { id, roleplay } = user.rows[0] as IUser;

        if (roleplay === 'backers') {
          const alchemy = new Alchemy(this.settings);
          const provider = await alchemy.config.getProvider();
          const signer = new Wallet(this.walletKey, provider);
          const contract = new Contract(this.contractAddress, JSON.parse(nftAbi), signer);
          const badgeCount = await contract.getTotalBadgeCount();

          const accounts = [];
          for (let i = 0; i < badgeCount.toNumber(); i++) accounts.push(address);

          contractBadges = await getBalanceOfBatch({ address, config: this });
        }

        const badges = await db.query(
          `SELECT 
            *, 
            CASE
              WHEN creator_id = $1 THEN True
              ELSE false
            END AS is_creator
          FROM badges 
          ${contractBadges ? `WHERE token_id IN (${Object.keys(contractBadges)})` : 'WHERE creator_id = $1'} 
          ORDER BY created_at DESC`,
          [id],
        );
        if (badges.rowCount) return res.status(HttpCode.OK).json(badges.rows);
        return res.status(HttpCode.OK).json([]);
      }
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async getBadge(req: Request, res: Response, next: NextFunction) {
    try {
      this.setWalletConfig();

      const { id, address } = req.params;

      const badge = await db.query(`SELECT * FROM badges WHERE id = $1`, [id]);
      const user = await db.query('SELECT id, roleplay FROM users WHERE wallet_address = $1', [address]);

      if (badge.rowCount && user.rowCount) {
        const badgeInfo = badge.rows[0];
        const { token_id } = badgeInfo;
        const { id: userID, roleplay } = user.rows[0] as IUser;

        let balance = null;

        if (roleplay === 'backers' && token_id) {
          const alchemy = new Alchemy(this.settings);
          const provider = await alchemy.config.getProvider();
          const signer = new Wallet(this.walletKey, provider);
          const contract = new Contract(this.contractAddress, JSON.parse(nftAbi), signer);
          const contractBalance = await contract.balanceOf(address, token_id);
          balance = contractBalance.toNumber();
        }

        if (roleplay === 'creators') {
          const balanceInfo = await db.query(
            `SELECT COUNT(ub.badge_id), ub.badge_id 
              FROM users_assigned_badges ub
              LEFT JOIN badges b
              ON b.id = ub.badge_id 
              WHERE ub.badge_id = $1 AND b.creator_id = $2
              GROUP BY ub.badge_id`,
            [id, userID],
          );

          if (balanceInfo.rowCount) {
            const countInfo = balanceInfo.rows[0];
            balance = countInfo ? Number(countInfo.count) : 0;
          }
        }
        return res.status(HttpCode.OK).json({ ...badgeInfo, assigned: balance || 0 });
      }
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async deleteBadge(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deletedBadge = await db.query(`DELETE FROM badges WHERE id = $1 RETURNING *;`, [id]);
      if (deletedBadge.rowCount) return res.status(HttpCode.OK).json(deletedBadge.rows[0]);
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async assignBadge(
    req: Request<RequestParams, ResponseBody, IBagdeAssignInfo, RequestQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { badgeID, supporter_wallet_address, token_id } = req.body;

      const supporterInfo = await db.query('SELECT id FROM users WHERE wallet_address = $1', [
        supporter_wallet_address,
      ]);

      if (supporterInfo.rowCount) {
        const { id: userID } = supporterInfo.rows[0];

        const alchemy = new Alchemy(this.settings);
        const provider = await alchemy.config.getProvider();
        const signer = new Wallet(this.walletKey, provider);
        const contract = new Contract(this.contractAddress, JSON.parse(nftAbi), signer);

        let tokenID = token_id;

        if (!parseBool(tokenID)) {
          const badgeCount = await contract.getTotalBadgeCount();
          tokenID = badgeCount.toNumber() + 1;
        }

        const tx = await contract.mint(supporter_wallet_address, tokenID, 1, []);
        const mintInfo = await tx.wait();

        if (mintInfo?.status === 1) {
          if (!parseBool(token_id))
            await db.query('UPDATE badges SET token_id = $1 WHERE id = $2 RETURNING *', [tokenID, badgeID]);

          await db.query(
            `INSERT INTO users_assigned_badges (user_id, badge_id) 
              values ($1, $2) RETURNING *;`,
            [userID, badgeID],
          );
          return res.status(HttpCode.CREATED).json(mintInfo.transactionHash);
        }
      }
      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }

  async getBadgesHolders(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const holders = await db.query(
        `
            SELECT DISTINCT u.*
            FROM users_assigned_badges ub
            LEFT JOIN users u
            ON ub.user_id = u.id
            WHERE u.id IS NOT NULL AND ub.badge_id = $1`,
        [id],
      );
      if (holders.rowCount) return res.status(HttpCode.OK).json(holders.rows);
      return res.status(HttpCode.OK).json([]);
    } catch (error) {
      next(error);
    }
  }

  async getMintPrice(
    req: Request<RequestParams, ResponseBody, RequestBody, IQueryPriceParams>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      this.setWalletConfig();
      const { wallet_address, token_id } = req.query;

      const alchemy = new Alchemy(this.settings);
      const provider = await alchemy.config.getProvider();
      const signer = new Wallet(this.walletKey, provider);

      const gasPrice = await provider.getGasPrice();

      const contract = new Contract(this.contractAddress, JSON.parse(nftAbi), signer);
      let tokenID = token_id;
      if (!parseBool(tokenID)) {
        const badgeCount = await contract.getTotalBadgeCount();
        tokenID = badgeCount.toNumber() + 1;
      }

      const mintGasCount = await contract.estimateGas.mint(wallet_address, tokenID, 1, []); // Number(quantity)

      if (gasPrice && mintGasCount) {
        const price = (gasPrice.toNumber() * mintGasCount.toNumber()) / 1e18;
        return res.status(HttpCode.OK).json(price);
      }

      return res.sendStatus(HttpCode.NOT_FOUND);
    } catch (error) {
      next(error);
    }
  }
}

export default BadgeController;
