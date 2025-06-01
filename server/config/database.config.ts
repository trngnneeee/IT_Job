import mongoose from "mongoose";

export const connectDatabase = async () => {
  try{
    await mongoose.connect(`${process.env.DATABASE}`);
    console.log("Connect to Database successfully!");
  }
  catch(error)
  {
    console.log("Connect to Database unsuccessfully!", error);
  }
}