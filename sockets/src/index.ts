import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { INewDonatSocketObj, ISocketNotification } from 'types';
import db from './utils/db.js';
import { getActiveRooms } from './utils/index.js';

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
    const { supporter, creator, donation_id } = data;
    const rooms = getActiveRooms(io.sockets.adapter.rooms);
    if (rooms.length) {
      const userRoom = rooms.find(({ room }) => room === creator.username);
      if (userRoom) {
        const userSockets = userRoom.sockets;
        const donation = await db.query(`SELECT * from donations WHERE id = $1;`, [donation_id]);

        if (donation.rows[0]) {
          const { id, sum_donation, blockchain, donation_message } = donation.rows[0];

          const newTransaction = await db.query(`INSERT INTO notifications (donation) values ($1) RETURNING id;`, [id]);
          if (newTransaction.rows[0]) {
            const { id } = newTransaction.rows[0];
            await db.query(
              `INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`,
              [creator.id, id, 'recipient'],
            );
            await db.query(
              `INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`,
              [supporter.id, id, 'sender'],
            );

            userSockets.length &&
              userSockets.forEach((socketID) => {
                const sendObj: ISocketNotification = {
                  type: 'donat',
                  supporter: supporter.username,
                  additional: {
                    sum_donation,
                    blockchain,
                    donation_message,
                  },
                };
                io.sockets.to(socketID).emit('new_notification', sendObj);
              });
          }
        }
      }
    }
  });

  // socket.on('new_badge', async (data: IMintBadgeSocketObj) => {
  //   const { supporter, creator, badge } = data;
  //   const rooms = getActiveRooms(io.sockets.adapter.rooms);
  //   if (rooms.length) {
  //     const userRoom = rooms.find(({ room }) => room === supporter.username);
  //     if (userRoom) {
  //       const userSockets = userRoom.sockets;
  //       userSockets &&
  //         userSockets.length &&
  //         userSockets.forEach((socketID) =>
  //           io.sockets.to(socketID).emit('new_notification', {
  //             type: 'add_badge',
  //             supporter: supporter.username,
  //             badge_name: badge.name,
  //           }),
  //         );

  //       const newNotification = await db.query(`INSERT INTO notifications (badge) values ($1) RETURNING id;`, [
  //         badge.id,
  //       ]);
  //       const notificationID = newNotification.rows[0] && newNotification.rows[0].id;
  //       if (notificationID) {
  //         await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
  //           creator.id,
  //           notificationID,
  //           'sender',
  //         ]);
  //         await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
  //           supporter.id,
  //           notificationID,
  //           'recipient',
  //         ]);
  //       }
  //     }
  //   }
  // });
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
