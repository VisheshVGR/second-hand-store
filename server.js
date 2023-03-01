require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const connectDb = require('./db/connect');

// security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');
const authenticateUserMiddleware = require('./middleware/authentication');

const cataloueRouter = require('./routes/catalogue');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');

const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

// Home Page
app.get('/', (req, res) => {
  res.send(
    '<h1>Welcome to <b>second-hand-store</b>!</h1> <h3><a href="https://documenter.getpostman.com/view/15926122/2s93CSoAyW">Read Documentation</a></h3>'
  );
});

// routes
app.use('/api/v1/catalogue', cataloueRouter);
app.use('/api/v1/products', authenticateUserMiddleware, productsRouter);
app.use('/api/v1/auth', authRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URI_DEV);
    app.listen(
      PORT,
      console.log(`DB connected & Server running on port:${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};
startServer();
