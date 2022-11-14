const db = require("./db");

const getActiveRooms = (io) => {
  // Convert map into 2D list:
  // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
  const arr = Array.from(io.sockets.adapter.rooms);
  const filtered = arr.filter((room) => !room[1].has(room[0]));
  const res = filtered.map((i) => ({ room: i[0], sockets: Array.from(i[1]) }));
  return res;
};

const socketHandler = async (socket, io) => {
  const { userName } = socket.handshake.query;
  socket.join(userName);

  socket.on("new_donat", async (data) => {
    const {
      supporter,
      creator_id,
      creator_username,
      sum,
      donationID,
      blockchain,
    } = data;
    const rooms = getActiveRooms(io);
    if (rooms.length) {
      const userRoom = rooms.find(({ room }) => room === creator_username);
      if (userRoom) {
        const userSockets = userRoom.sockets;
        const donation = await db.query(
          `SELECT donation_message from donations WHERE id = $1;`,
          [donationID]
        );

        donation.rows[0] &&
          userSockets &&
          userSockets.length &&
          userSockets.forEach((socketID) =>
            io.sockets.to(socketID).emit("new_notification", {
              type: "donat",
              supporter: supporter.username,
              additional: {
                sum,
                blockchain,
                message: donation.rows[0].donation_message,
              },
            })
          );
        await db.query(
          `INSERT INTO notifications (donation, sender, recipient) values ($1, $2, $3);`,
          [donationID, supporter.id, creator_id]
        );
      }
    }
  });

  socket.on("new_badge", async (data) => {
    const { supporter, creator_id, badgeID, badgeName } = data; // creator_username
    const rooms = getActiveRooms(io);
    if (rooms.length) {
      const userRoom = rooms.find(({ room }) => room === supporter.username);
      if (userRoom) {
        const userSockets = userRoom.sockets;
        userSockets &&
          userSockets.length &&
          userSockets.forEach((socketID) =>
            io.sockets.to(socketID).emit("new_notification", {
              type: "add_badge",
              supporter: supporter.username,
              badgeName,
            })
          );
        await db.query(
          `INSERT INTO notifications (badge, sender, recipient) values ($1, $2, $3);`,
          [badgeID, creator_id, supporter.id]
        );
      }
    }
  });

  socket.on("check_badge", async (data) => {
    const { username, user_id, result, badge_id, transaction_hash } = data;

    const rooms = getActiveRooms(io);
    if (rooms.length) {
      const userRoom = rooms.find(({ room }) => room === username);

      if (userRoom) {
        const userSockets = userRoom.sockets;

        const isFailed = result === "FAILED" || result === "OUT_OF_ENERGY";
        const isSuccesed = result === "SUCCESS";
        const failedType = isFailed && "failed_badge";
        const succesedType = isSuccesed && "success_badge";

        await db.query(
          `INSERT INTO notifications (badge, sender, recipient) values ($1, $2, $3)`,
          [badge_id, user_id, user_id]
        );

        isFailed &&
          (await db.query(
            `UPDATE badges SET transaction_status = 'failed' where id = $1`,
            [badge_id]
          ));

        isSuccesed &&
          (await db.query(
            `UPDATE badges SET transaction_status = 'success' where id = $1`,
            [badge_id]
          ));

        if (userSockets && userSockets.length) {
          userSockets.forEach((socketID) =>
            io.sockets.to(socketID).emit("new_notification", {
              type: failedType || succesedType,
              badge: { id: badge_id, transaction_hash },
            })
          );
        }
      }
    }
  });
};

module.exports = socketHandler;
