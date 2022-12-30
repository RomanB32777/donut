import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import db from './utils/db.js';
import { getActiveRooms } from './utils/index.js';
import { INewDonatSocketObj, IMintBadgeSocketObj } from 'types';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  path: '/sockt/',
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  const { userName } = socket.handshake.query;
  userName && socket.join(userName);

  console.log('connect', userName);

  socket.on('error', (error) => {
    console.log(error);
  });

  socket.on('new_donat', async (data: INewDonatSocketObj) => {
    const { supporter, creator, sum, donation_id, blockchain } = data;
    const rooms = getActiveRooms(io.sockets.adapter.rooms);
    if (rooms.length) {
      const userRoom = rooms.find(({ room }) => room === creator.username);
      if (userRoom) {
        const userSockets = userRoom.sockets;
        const donation = await db.query(`SELECT donation_message from donations WHERE id = $1;`, [donation_id]);

        donation.rows[0] &&
          userSockets &&
          userSockets.length &&
          userSockets.forEach((socketID) =>
            io.sockets.to(socketID).emit('new_notification', {
              type: 'donat',
              supporter: supporter.username,
              additional: {
                sum,
                blockchain,
                message: donation.rows[0].donation_message,
              },
            }),
          );
        const newTransaction = await db.query(`INSERT INTO notifications (donation) values ($1) RETURNING id;`, [
          donation_id,
        ]);
        const transactionID = newTransaction.rows[0] && newTransaction.rows[0].id;
        if (transactionID) {
          await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
            creator.id,
            transactionID,
            'recipient',
          ]);
          await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
            supporter.id,
            transactionID,
            'sender',
          ]);
        }
      }
    }
  });

  socket.on('new_badge', async (data: IMintBadgeSocketObj) => {
    const { supporter, creator, badge } = data;
    const rooms = getActiveRooms(io.sockets.adapter.rooms);
    if (rooms.length) {
      const userRoom = rooms.find(({ room }) => room === supporter.username);
      if (userRoom) {
        const userSockets = userRoom.sockets;
        userSockets &&
          userSockets.length &&
          userSockets.forEach((socketID) =>
            io.sockets.to(socketID).emit('new_notification', {
              type: 'add_badge',
              supporter: supporter.username,
              badge_name: badge.name,
            }),
          );

        const newNotification = await db.query(`INSERT INTO notifications (badge) values ($1) RETURNING id;`, [
          badge.id,
        ]);
        const notificationID = newNotification.rows[0] && newNotification.rows[0].id;
        if (notificationID) {
          await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
            creator.id,
            notificationID,
            'sender',
          ]);
          await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
            supporter.id,
            notificationID,
            'recipient',
          ]);
        }
      }
    }
  });

  socket.on('check_badge', async (data) => {
    const { username, user_id, result, badge_id, transaction_hash } = data;

    // id?: number;
    // contract_address: string;
    // creator_id: number;
    // contributor_user_id_list?: string;
    // blockchain: string;
    // transaction_hash: string;
    // result: badgeStatus | null;

    const rooms = getActiveRooms(io.sockets.adapter.rooms);
    if (rooms.length) {
      const userRoom = rooms.find(({ room }) => room === username);

      if (userRoom) {
        const userSockets = userRoom.sockets;

        const isFailed = result === 'FAILED' || result === 'OUT_OF_ENERGY';
        const isSuccesed = result === 'SUCCESS';
        const failedType = isFailed && 'failed_badge';
        const succesedType = isSuccesed && 'success_badge';

        const newNotification = await db.query(`INSERT INTO notifications (badge) values ($1) RETURNING id;`, [
          badge_id,
        ]);

        const notificationID = newNotification.rows[0] && newNotification.rows[0].id;
        if (notificationID)
          await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
            user_id,
            notificationID,
            'sender',
          ]);

        isFailed && (await db.query(`UPDATE badges SET transaction_status = 'failed' where id = $1`, [badge_id]));

        isSuccesed && (await db.query(`UPDATE badges SET transaction_status = 'success' where id = $1`, [badge_id]));

        if (userSockets && userSockets.length) {
          userSockets.forEach((socketID) =>
            io.sockets.to(socketID).emit('new_notification', {
              type: failedType || succesedType,
              badge: { id: badge_id, transaction_hash },
            }),
          );
        }
      }
    }
  });
});

const start = async () => {
  try {
    const port = process.env.PORT || 4005;
    server.listen(port, () => console.log(`Socket app has been started on port ${port}...`));
  } catch (e) {
    console.log('Socket server error', e); // e.message
    process.exit(1);
  }
};

start();
