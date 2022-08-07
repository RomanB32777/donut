const express = require('express')
const app = express()
const fileupload = require("express-fileupload")
const path = require('path')
const fs = require('fs')

// const sockPath = `${path.resolve(__dirname, './sock')}/server.sock`
const userRouter = require('./routes/user.routes')
const badgeRouter = require('./routes/badge.routes')
const donationRouter = require('./routes/donation.routes')
const nftRouter = require('./routes/nft.routes')

const cors = require('cors')

app.use(cors())
app.use(fileupload())
app.use(express.json())
app.use('/images', express.static(__dirname + '/images'))
// app.use(express.static(path.resolve(__dirname, '../client/build')))
app.use('/api/user/', userRouter)
app.use('/api/badge/', badgeRouter)
app.use('/api/donation/', donationRouter)
app.use('/api/nft/', nftRouter)

async function start() {
	try {
		const port = process.env.PORT || 5000
		app.listen(port, () => console.log(`App has been started on port ${port}...`))
		//console.log(sockPath);
		// fs.existsSync(sockPath) && fs.rmSync(sockPath)
		// app.listen(sockPath, () => fs.chmod(sockPath, 0o666, () => {console.log(`App has been started on ${sockPath}`)}))
	} catch(e) {
		console.log('Server error', e.message)
		process.exit(1)
	}
}

start() 