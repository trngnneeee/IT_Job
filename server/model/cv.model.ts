import mongoose from "mongoose";

const schema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  jobId: String,
  fileCV: String,
  viewed: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: "initial"
  }
}, {
  timestamps: true
})

const CV = mongoose.model('CV', schema, "cvs");

export default CV;