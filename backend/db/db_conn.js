import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`
    );

    console.log(
      "MongoDB connected.. DB HOST",
      connectionInstance.connection.host
    );

    // console.log('Full connection instance', connectionInstance);
  } catch (error) {
    console.log("MongoDB Connection FAILED", error);
    //process is a node variable, which is a reference to current running process, so here we either throw err or exit the process with some code
    process.exit(1);
  }
};

export { connectDB };

// console.log(process.env.MONGO_DB_URI);
