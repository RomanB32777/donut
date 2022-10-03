const db = require('./db')

const getActiveRooms = (io) => {
    // Convert map into 2D list:
    // ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
    const arr = Array.from(io.sockets.adapter.rooms);
    const filtered = arr.filter(room => !room[1].has(room[0]))
    const res = filtered.map(i => ({ room: i[0], sockets: Array.from(i[1]) }));
    return res;
}

const socketHandler = async (socket) => {
    const { userName } = socket.handshake.query;
    socket.join(userName);

    socket.on('new_donat', async (data) => {
        const { supporter, creator_id, creator_username, sum, donationID, wallet } = data;
        const rooms = getActiveRooms(io);

        if (rooms.length) {
            const userSockets = rooms.find(({ room }) => room === creator_username).sockets;
            const donation = await db.query(`SELECT donation_message from donations WHERE id = $1;`, [donationID]);

            donation.rows[0] && userSockets && userSockets.length && userSockets.forEach(socketID =>
                socket.to(socketID).emit("new_notification", {
                    type: 'donat', supporter: supporter.username, additional: {
                        sum,
                        wallet,
                        message: donation.rows[0].donation_message,
                    }
                })
            );
            await db.query(`INSERT INTO notifications (donation, sender, recipient) values ($1, $2, $3);`, [donationID, supporter.id, creator_id])
        }
    });

    socket.on('new_badge', async (data) => {
        const { supporter, creator_id, badgeID, badgeName } = data; // creator_username
        const rooms = getActiveRooms(io);
        if (rooms.length) {
            const userSockets = rooms.find(({ room }) => room === supporter.username).sockets;
            userSockets && userSockets.length && userSockets.forEach(socketID =>
                socket.to(socketID).emit("new_notification", { type: 'add_badge', supporter: supporter.username, badgeName })
            );
            await db.query(`INSERT INTO notifications (badge, sender, recipient) values ($1, $2, $3);`, [badgeID, creator_id, supporter.id])
        }
    });
}

module.exports = socketHandler
