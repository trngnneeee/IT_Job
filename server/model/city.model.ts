import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: String
})

const Cities = mongoose.model('Cities', schema, "cities");

export default Cities;