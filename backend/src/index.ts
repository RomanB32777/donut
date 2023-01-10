import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import fileRouter from './routes/file.routes.js';
import userRouter from './routes/user.routes.js';
import badgeRouter from './routes/badge.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import donationRouter from './routes/donation.routes.js';
import widgetRouter from './routes/widget.routes.js';
import notificationRouter from './routes/notification.routes.js';

import { assetsFolder, isProduction, uploadsFolder } from './consts.js';

!isProduction && dotenv.config();

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  }),
);
app.use(express.json());
app.use(errorMiddleware);
app.use(`/${assetsFolder}`, express.static(__dirname + `/${assetsFolder}`));
app.use(`/${uploadsFolder}`, express.static(__dirname + `/${uploadsFolder}`));
app.use('/api/file/', fileRouter);
app.use('/api/user/', userRouter);
app.use('/api/badge/', badgeRouter);
app.use('/api/donation/', donationRouter);
app.use('/api/widget/', widgetRouter);
app.use('/api/notification/', notificationRouter);

const start = async () => {
  try {
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`App has been started on port ${port}...`));
  } catch (e) {
    console.log('Server error', e); // e.message
    process.exit(1);
  }
};

start();
