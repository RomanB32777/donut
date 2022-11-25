const db = require("../db");
const getRandomStr = require("../utils");

class UserController {
  async checkUsername(req, res) {
    try {
      const { username } = req.body;
      const user = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);
      if (user.rows.length > 0 && user.rows[0].username === username) {
        res.status(200).json({ error: true });
      } else {
        res.status(200).json({ error: false });
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async checkUserExist(req, res) {
    try {
      const { token } = req.body;
      const user = await db.query(
        "SELECT * FROM users WHERE tronlink_token = $1 OR metamask_token = $1 OR near_token = $1",
        [token]
      );
      if (user.rows && user.rows.length === 0) {
        res.status(200).json({ notExist: true });
      } else {
        res.status(200).json(user.rows[0]);
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async createUser(req, res) {
    try {
      const { username, token, role, typeWallet } = req.body;
      const date = new Date();
      const newUser = await db.query(
        `INSERT INTO users (${typeWallet}_token, username, roleplay) values ($1, $2, $3) RETURNING *;`,
        [token, username.toLowerCase(), role]
      );
      if (role === "creators") {
        const security_string = getRandomStr(10);
        await db.query(
          `INSERT INTO creators (user_id, creation_date, security_string) values ($1, $2, $3) RETURNING *`,
          [newUser.rows[0].id, date, security_string]
        );
        const alertID = getRandomStr(6);
        await db.query(
          `INSERT INTO alerts (id, creator_id) values ($1, $2) RETURNING *`,
          [alertID, newUser.rows[0].id]
        );
        res.status(200).json({ message: "Creator created!" });
      } else {
        await db.query(
          `INSERT INTO backers (user_id, creation_date) values ($1, $2) RETURNING *`,
          [newUser.rows[0].id, date]
        ); // username.toLowerCase(),
        res
          .status(200)
          .json({ message: "Backer created!", newUser: newUser.rows[0] });
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async deleteUser(req, res) {
    try {
      const { user_id } = req.body;
      const deletedUser = await db.query(
        `DELETE FROM users WHERE id = $1 RETURNING *;`,
        [user_id]
      );
      res.status(200).json({ deletedUser: deletedUser.rows[0] });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getUser(req, res) {
    try {
      const { token } = req.params;
      const user = await db.query(
        "SELECT * FROM users WHERE tronlink_token = $1 OR metamask_token = $1 OR near_token = $1",
        [token]
      );
      if (user.rows[0] && user.rows[0].id) {
        const role = await db.query(
          `SELECT * FROM ${user.rows[0].roleplay} WHERE user_id = $1`,
          [user.rows[0].id]
        );
        res.status(200).json({ ...role.rows[0], ...user.rows[0] }); // subscriptions
      } else {
        res.status(200).json({});
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getUserByID(req, res) {
    try {
      const id = req.params.id;
      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
      res.status(200).json({ user: user.rows[0] });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getUserNotifications(req, res) {
    try {
      const { user } = req.params;
      const { blockchain, limit, offset, sort, sortDirection } = req.query;

      const userInfo = await db.query(
        `SELECT id, roleplay FROM users WHERE ${
          user.includes("@") ? "username" : "id"
        } = $1`,
        [user]
      );

      const notifications = await db.query(
        `SELECT COUNT(*) OVER() as total_count, * FROM notifications 
            WHERE sender = $1 OR recipient = $1 
            ORDER BY ${sort || "creation_date"} ${sortDirection || "DESC"}
            ${limit ? `LIMIT ${limit}` : ""}
            ${offset ? `OFFSET ${offset}` : ""}`,
        [userInfo.rows[0].id]
      );

      if (notifications && notifications.rows.length) {
        const notificationsAll = await Promise.all(
          notifications.rows.map(async (n) => {
            if (n.donation) {
              const roleplaySendler =
                userInfo.rows[0].roleplay === "creators" ? "backer" : "creator";

              const donation = await db.query(
                `SELECT donations.*, users.username FROM donations 
                    LEFT JOIN users
                    ON donations.${roleplaySendler}_id = users.id
                    WHERE donations.id = $1
                    ${blockchain ? ` AND blockchain = '${blockchain}'` : ""}`,
                [n.donation]
              );
              if (donation.rows[0]) return { ...n, donation: donation.rows[0] };
              return { ...n, donation: null };
            }
            if (n.badge) {
              const badge = await db.query(
                `SELECT * FROM badges WHERE id = $1 
                  ${blockchain ? ` AND blockchain = '${blockchain}'` : ""}`,
                [n.badge]
              );
              if (badge.rows[0]) {
                const creator = await db.query(
                  `SELECT username FROM users WHERE id = $1`,
                  [n.sender]
                );
                const supporter = await db.query(
                  `SELECT username FROM users WHERE id = $1`,
                  [n.recipient]
                );
                if (creator.rows[0] && supporter.rows[0])
                  return {
                    ...n,
                    badge: {
                      ...badge.rows[0],
                      supporter_username: supporter.rows[0].username,
                      creator_username: creator.rows[0].username,
                    },
                  };
              }
              return { ...n, badge: null };
            }
          })
        );
        return res.status(200).json({
          notifications: notificationsAll,
          totalLength: +notificationsAll[0].total_count,
        });
      }
      return res.status(200).json({ notifications: [] });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async updateStatusNotifications(req, res) {
    try {
      const { read, id } = req.body;
      const updatedNotification = await db.query(
        `UPDATE notifications SET read = $1 where id = $2 RETURNING *`,
        [read, id]
      );
      return res.status(200).json({
        updatedNotification: updatedNotification.rows.length
          ? updatedNotification.rows[0]
          : [],
      });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async getCreatorByName(req, res) {
    try {
      const { username } = req.params;
      const creator = await db.query(
        `SELECT * FROM creators
            LEFT JOIN users
            ON creators.user_id = users.id
            WHERE users.username = $1`,
        [username]
      );
      if (creator.rows[0]) {
        res.status(200).json({ ...creator.rows[0] });
      } else {
        res.status(500).json({
          error: true,
          message: error.message || "User with this username not found!",
        });
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async editUser(req, res) {
    try {
      const {
        welcome_text,
        btn_text,
        main_color,
        background_color,
        username,
        user_id,
      } = req.body;
      let editedUser = {};
      let table = "backers";
      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [
        user_id,
      ]);

      if (user.rows[0].roleplay === "creators") {
        table = "creators";
      }

      if (username) {
        const editedUsername = await db.query(
          `UPDATE users SET username = $1 WHERE id = $2 RETURNING *`,
          [username, user.rows[0].id]
        );
        editedUser = {
          ...editedUser,
          username: editedUsername.rows[0].username,
        };
      } else {
        if ((table = "creators")) {
          const editedDBUser = await db.query(
            `UPDATE ${table} SET welcome_text = $1, btn_text = $2, main_color = $3, background_color = $4 WHERE user_id = $5 RETURNING *`,
            [
              welcome_text,
              btn_text,
              main_color,
              background_color,
              user.rows[0].id,
            ]
          );
          editedUser = editedDBUser.rows[0];
        }
      }
      res.status(200).json({ editedUser });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async editUserWallet(req, res) {
    try {
      const { user_id } = req.params;
      const { type_wallet, token } = req.body;
      if (type_wallet && token && user_id) {
        const editedUser = await db.query(
          `UPDATE users SET ${type_wallet}_token = $1 WHERE id = $2 RETURNING *`,
          [token, user_id]
        );
        res.status(200).json(editedUser);
      } else {
        res.status(500).json({ error: true, message: "Something broke!" });
      }
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async editUserImage(req, res) {
    try {
      const { user_id } = req.params;
      const file = req.files.file;
      const filename = getRandomStr(32);
      file.mv(
        `images/${filename + file.name.slice(file.name.lastIndexOf("."))}`,
        (err) => {}
      );
      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [
        user_id,
      ]);
      let table = "backers";
      if (user.rows[0].roleplay === "creators") {
        table = "creators";
      }
      await db.query(`UPDATE ${table} SET avatarlink = $1 WHERE user_id = $2`, [
        filename + file.name.slice(file.name.lastIndexOf(".")),
        user.rows[0].id,
      ]);
      res.status(200).json({ message: "success" });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }

  async editCreatorBackgroundImage(req, res) {
    try {
      const user_id = req.params.user_id;
      const file = req.files.file;
      const filename = getRandomStr(32);
      file.mv(
        `images/${filename + file.name.slice(file.name.lastIndexOf("."))}`,
        (err) => {}
      );
      const user = await db.query(`SELECT * FROM users WHERE id = $1`, [
        user_id,
      ]);
      let table = "backers";
      if (user.rows[0].roleplay === "creators") {
        table = "creators";
      }
      await db.query(
        `UPDATE ${table} SET backgroundlink = $1 WHERE user_id = $2`,
        [
          filename + file.name.slice(file.name.lastIndexOf(".")),
          user.rows[0].id,
        ]
      );
      res.status(200).json({ message: "success" });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ error: true, message: error.message || "Something broke!" });
    }
  }
}

module.exports = new UserController();
