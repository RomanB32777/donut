const express = require('express')
const app = express()
const fileupload = require("express-fileupload")

// const sockPath = `${path.resolve(__dirname, './sock')}/server.sock`
const userRouter = require('./routes/user.routes')
const badgeRouter = require('./routes/badge.routes')
const donationRouter = require('./routes/donation.routes')
const nftRouter = require('./routes/nft.routes')

const cors = require('cors')

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	path: '/sockt/',
	cors: {
		origin: '*' // 'http://localhost:3000/'
	}
});

const db = require('./db')


app.use(cors())
app.use(fileupload())
app.use(express.json())
app.use('/images', express.static(__dirname + '/images'))
// app.use(express.static(path.resolve(__dirname, '../client/build')))
app.use('/api/user/', userRouter)
app.use('/api/badge/', badgeRouter)
app.use('/api/donation/', donationRouter)
app.use('/api/nft/', nftRouter)

const getActiveRooms = (io) => {
	// Convert map into 2D list:
	// ==> [['4ziBKG9XFS06NdtVAAAH', Set(1)], ['room1', Set(2)], ...]
	const arr = Array.from(io.sockets.adapter.rooms);
	const filtered = arr.filter(room => !room[1].has(room[0]))
	const res = filtered.map(i => ({ room: i[0], sockets: Array.from(i[1]) }));
	return res;
}


io.on('connection', async (socket) => {
	const { userName } = socket.handshake.query;
	socket.join(userName);

	// console.log('a user connected ', userId, socket.id);
	socket.on('new_donat', async (data) => {
		const { supporter, creator_id, creator_username, sum, donationID, wallet } = data;
		const rooms = getActiveRooms(io);
		if (rooms.length) {
			const userSockets = rooms.find(({ room }) => room === creator_username)?.sockets;
			const donation = await db.query(`SELECT donation_message from donations WHERE id = $1;`, [donationID])

			donation.rows[0] && userSockets && userSockets.length && userSockets.forEach(socketID =>
				socket.to(socketID).emit("new_notification", {
					type: 'donat', supporter: supporter.username, additional: {
						sum,
						wallet,
						message: donation.rows[0].donation_message
					}
				})
			);
			await db.query(`INSERT INTO notifications (donation, sender, senderName, recipient, recipientName) values ($1, $2, $3, $4, $5);`, [donationID, supporter.id, supporter.username, creator_id, creator_username])
		}
	});

	socket.on('new_following', async (data) => {
		const { follower, creator_id, creator_username, followID } = data;
		const rooms = getActiveRooms(io);
		if (rooms.length) {
			const userSockets = rooms.find(({ room }) => room === creator_username).sockets;
			userSockets && userSockets.length && userSockets.forEach(socketID =>
				socket.to(socketID).emit("new_notification", { type: 'following', follower: follower.username })
			);
			await db.query(`INSERT INTO notifications (follow, sender, recipient) values ($1, $2, $3);`, [followID, follower.id, creator_id])
		}
	});

	socket.on('new_badge', async (data) => {
		const { supporter, creator_id, creator_username, badgeID, badgeName } = data;
		const rooms = getActiveRooms(io);
		if (rooms.length) {
			const userSockets = rooms.find(({ room }) => room === supporter.username).sockets;
			userSockets && userSockets.length && userSockets.forEach(socketID =>
				socket.to(socketID).emit("new_notification", { type: 'add_badge', supporter: supporter.username, badgeName })
			);
			await db.query(`INSERT INTO notifications (badge, sender, senderName, recipient, recipientName) values ($1, $2, $3, $4, $5);`, [badgeID, creator_id, creator_username, supporter.id, supporter.username])
		}
	});

	socket.on('remove_badge', async (data) => {
		const { supporter, creator_id, badgeID, badgeName } = data;
		const rooms = getActiveRooms(io);
		if (rooms.length) {
			const userSockets = rooms.find(({ room }) => room === supporter.username).sockets;
			userSockets && userSockets.length && userSockets.forEach(socketID =>
				socket.to(socketID).emit("new_notification", { type: 'remove_badge', supporter: supporter.username, badgeName })
			);
			await db.query(`INSERT INTO notifications (badge, sender, recipient) values ($1, $2, $3);`, [badgeID, creator_id, supporter.id])
		}
	});

	// console.log('a user connected ', userId, socket.id);
	// const socketDB = await db.query('SELECT * FROM sockets WHERE user_id = $1', [userId])
	// if (socketDB.rows && !socketDB.rows.length) {
	// }

	// io.allSockets().then(data => console.log(data))
	// socket.on('connect_user', (data) => {
	// 	console.log(data);
	// 	// io.sockets.emit('add_mess', data);
	// })
	// console.log("ROOMS", );
	// for (const room of socket.rooms) {
	// 	console.log(room);
	// }

	// socket.on('disconnect', (reason) => {
	// 	console.log('disconnect', reason);
	// })
});


async function start() {
	try {
		const port = process.env.PORT || 5000
		server.listen(port, () => console.log(`App has been started on port ${port}...`))
		// fs.existsSync(sockPath) && fs.rmSync(sockPath)
		// app.listen(sockPath, () => fs.chmod(sockPath, 0o666, () => {console.log(`App has been started on ${sockPath}`)}))
	} catch (e) {
		console.log('Server error', e.message)
		process.exit(1)
	}
}

start()