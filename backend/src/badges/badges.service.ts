import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Alchemy, BigNumber, Contract, Network, Wallet } from 'alchemy-sdk';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { abi } from 'src/common/const';

import { CreateBadgeDto } from './dto/create-badge.dto';
import { AssignBadgeDto } from './dto/assign-badge.dto';
import { Badge } from './entities/badge.entity';

@Injectable()
export class BadgesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FilesService,
    private readonly usersService: UsersService,

    @InjectRepository(Badge)
    private badgesRepository: Repository<Badge>,
  ) {}

  getConfigs() {
    return {
      walletKey: this.configService.get<string>('WALLET_KEY'),
      contractAddress: this.configService.get<string>('CONTRACT_ADDRESS'),
      settings: {
        apiKey: this.configService.get<string>('CONTRACT_API_KEY'),
        network: Network.MATIC_MUMBAI,
      },
    };
  }

  async getWalletInfo() {
    const { settings, walletKey, contractAddress } = this.getConfigs();
    const alchemy = new Alchemy(settings);
    const provider = await alchemy.config.getProvider();
    const signer = new Wallet(walletKey, provider);
    const contract = new Contract(contractAddress, JSON.parse(abi), signer);
    return { provider, contract };
  }

  async create(createBadgeDto: CreateBadgeDto, file: Express.Multer.File) {
    const { id } = createBadgeDto.creator;
    const { path } = this.fileService.uploadFile(file, id, 'badges');
    return await this.badgesRepository.save({
      ...createBadgeDto,
      image: path,
    });
  }

  async findAll(user: User) {
    const { id: userId, roleplay, walletAddress } = user;
    const tokens = [];

    if (roleplay === 'backers') {
      const { contract } = await this.getWalletInfo();
      const badgeCount = await contract.getTotalBadgeCount();

      const accounts = [];
      for (let i = 0; i < badgeCount.toNumber(); i++) {
        accounts.push(walletAddress);
      }

      const resultBalance: BigNumber[] = await contract.balanceOfBatch(
        accounts,
        accounts.map((_, key) => key + 1),
      );

      const contractBadges = resultBalance.reduce((badges, curr, key) => {
        const intCount = curr.toNumber();
        if (intCount) return { ...badges, [key + 1]: intCount };
        return badges;
      }, {} as Record<string, number>);

      for (const key in contractBadges) {
        tokens.push(key);
      }
    }

    const query = this.badgesRepository
      .createQueryBuilder('b')
      .select('b.id', 'id')
      .addSelect('b.title', 'title')
      .addSelect('b.image', 'image')
      .addSelect('b.description', 'description')
      .addSelect('b.tokenId', 'tokenId')
      .addSelect(
        `
          CASE 
            WHEN creator.id = :userId THEN True
            ELSE false 
          END
          `,
        'isCreator',
      )
      .leftJoin('b.creator', 'creator')
      .where('creator.id = :userId', { userId })
      .orderBy('b.createdAt', 'DESC');

    if (tokens.length) {
      query.orWhere('b.tokenId IN (:...tokens)', { tokens });
    }
    return await query.getRawMany();
    // .find({
    //   where: [{ tokenId: In(tokens) }, { creator: { id: userId } }],
    //   order: { createdAt: 'DESC' },
    // });
  }

  async findOne(id: string, user?: User) {
    //: Promise<Badge | IBadgeInfo> {
    const badge = await this.badgesRepository.findOne({
      select: {
        creator: { id: true, username: true },
        holders: { id: true, username: true, avatarLink: true },
      },
      where: { id },
      relations: {
        holders: user ? user.roleplay === 'creators' : false,
        creator: true,
      },
    });

    if (badge) {
      if (!user) return badge;

      const { tokenId } = badge;
      const { id: userId, roleplay, walletAddress } = user;
      let balance = 0;

      if (roleplay === 'backers' && tokenId) {
        const { contract } = await this.getWalletInfo();
        const contractBalance = await contract.balanceOf(
          walletAddress,
          tokenId,
        );
        balance = contractBalance.toNumber();
      }

      if (roleplay === 'creators' && userId === badge.creator.id) {
        balance = badge.holders.length;
      }
      return {
        ...badge,
        isCreator: badge.creator.id === user.id,
        assigned: balance,
      };
    }
  }

  async findOneById(id: string, isVisibleHolders = false) {
    return await this.badgesRepository.findOne({
      where: { id },
      relations: {
        holders: isVisibleHolders,
      },
    });
  }

  async getBadgeHolders(id: string) {
    const badgeInfo = await this.findOneById(id, true);
    return badgeInfo.holders;
  }

  async getAssignPrice({ userAddress, tokenId }: AssignBadgeDto) {
    const { provider, contract } = await this.getWalletInfo();
    const gasPrice = await provider.getGasPrice();

    let tokenID = tokenId;

    // TODO - parce undefined
    if (!tokenID) {
      const badgeCount = await contract.getTotalBadgeCount();
      tokenID = badgeCount.toNumber() + 1;
    }

    const mintGasCount = await contract.estimateGas.mint(
      userAddress,
      tokenID,
      1,
      [],
    ); // Number(quantity)

    if (gasPrice && mintGasCount) {
      const price = (gasPrice.toNumber() * mintGasCount.toNumber()) / 1e18;
      return price;
    }
    throw new HttpException(
      'Get price error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async assignBadge(id: string, { userAddress }: AssignBadgeDto) {
    const supporter = await this.usersService.getUserByAddress(userAddress);

    if (supporter) {
      const badgeInfo = await this.findOneById(id, true);

      const { contract } = await this.getWalletInfo();

      if (!badgeInfo.tokenId) {
        const badgeCount = await contract.getTotalBadgeCount();
        badgeInfo.tokenId = badgeCount.toNumber() + 1;
      }

      const tx = await contract.mint(userAddress, badgeInfo.tokenId, 1, []);
      const mintInfo = await tx.wait();

      if (mintInfo?.status === 1) {
        badgeInfo.holders.push(supporter);
        return await this.badgesRepository.save(badgeInfo);
      }
    }
    throw new BadRequestException('Assign error');
  }

  async remove(userId: string, id: string) {
    const { tokenId } = await this.findOneById(id);

    if (tokenId) {
      throw new HttpException(
        'You cannot delete a badge that already has a token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.badgesRepository.softDelete({
      id,
      creator: { id: userId },
    });
    return { id };
  }
}
