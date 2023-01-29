import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { IBadgeBase, ISocketEmitObj, ISocketNotification } from 'types';
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

  socket.on('new_donat', async (data: ISocketEmitObj) => {
    const { supporter, creator, id: donatID } = data;

    const donation = await db.query(`SELECT * from donations WHERE id = $1;`, [donatID]);

    if (donation.rows[0]) {
      const { sum_donation, blockchain, donation_message, is_anonymous } = donation.rows[0];

      const newNotification = await db.query(`INSERT INTO notifications (donation) values ($1) RETURNING id;`, [
        donatID,
      ]);
      if (newNotification.rows[0]) {
        const { id } = newNotification.rows[0];
        await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
          creator.id,
          id,
          'recipient',
        ]);
        await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
          supporter.id,
          id,
          'sender',
        ]);
      }
      const rooms = getActiveRooms(io.sockets.adapter.rooms);
      if (rooms.length) {
        const userRoom = rooms.find(({ room }) => room === creator.username);
        if (userRoom) {
          const userSockets = userRoom.sockets;

          userSockets.forEach((socketID) => {
            const sendObj: ISocketNotification = {
              type: 'donat',
              supporter: is_anonymous ? 'anonymous' : supporter.username,
              additional: {
                sum_donation,
                blockchain,
                donation_message,
              },
            };
            io.sockets.to(socketID).emit('new_donat_notification', sendObj);
          });
        }
      }
    }
  });

  socket.on('new_badge', async (data: ISocketEmitObj) => {
    const { supporter, creator, id: badgeID } = data;

    const badge = await db.query(`SELECT * from badges WHERE id = $1;`, [badgeID]);

    if (badge.rows[0]) {
      const { title } = badge.rows[0];

      const newNotification = await db.query(`INSERT INTO notifications (badge) values ($1) RETURNING id;`, [badgeID]);
      if (newNotification.rows[0]) {
        const { id } = newNotification.rows[0];

        await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
          creator.id,
          id,
          'sender',
        ]);
        await db.query(`INSERT INTO users_notifications (user_id, notification_id, roleplay) values ($1, $2, $3);`, [
          supporter.id,
          id,
          'recipient',
        ]);
      }

      const rooms = getActiveRooms(io.sockets.adapter.rooms);
      if (rooms.length) {
        const userRoom = rooms.find(({ room }) => room === supporter.username);
        if (userRoom) {
          const userSockets = userRoom.sockets;

          userSockets.forEach((socketID) => {
            const sendObj: ISocketNotification<IBadgeBase> = {
              type: 'add_badge',
              supporter: supporter.username,
              additional: {
                id: badgeID,
                title,
              },
            };
            io.sockets.to(socketID).emit('new_badge_notification', sendObj);
          });
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
