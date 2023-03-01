const mongoose = require('mongoose');

const connectDB = (connectionURL) => {
  mongoose.set('strictQuery', false);
  return mongoose.connect(connectionURL);
};

module.exports = connectDB;
