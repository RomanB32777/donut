const express = require("express");
const app = express();
const fileupload = require("express-fileupload");

const userRouter = require("./routes/user.routes");
const badgeRouter = require("./routes/badge.routes");
const donationRouter = require("./routes/donation.routes");
const widgetRouter = require("./routes/widget.routes");
const socketHandler = require("./sockets");

const cors = require("cors");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  path: "/sockt/",
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(fileupload());
app.use(express.json());
app.use("/images", express.static(__dirname + "/images"));
app.use("/api/user/", userRouter);
app.use("/api/badge/", badgeRouter);
app.use("/api/donation/", donationRouter);
app.use("/api/widget/", widgetRouter);

io.on("connection", (socket) => {
  socketHandler(socket, io);
});

async function start() {
  try {
    const port = process.env.PORT || 4000;
    server.listen(port, () =>
      console.log(`App has been started on port ${port}...`)
    );
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
}

start();
