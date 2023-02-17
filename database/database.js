const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const con = await mongoose.connect(process.env.MONGO_URI, { keepAlive: true, keepAliveInitialDelay: 300000, useNewUrlParser: true });
    console.log(`Database connected`, con.connections[0].host);
  } catch (e) {
    console.log("Cannot connect to database server. Exiting...");
    process.exit(1);
  }
}

module.exports = connectDB;
