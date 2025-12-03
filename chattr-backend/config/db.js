const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to Atlas");
  } catch (error) {
    console.error("Atlas Connection Failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
