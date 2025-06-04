import mongoose from "mongoose";

const schema = new mongoose.Schema({
  companyName: String,
  email: String,
  password: String
}, {
  timestamps: true
})

const CompanyAccount = mongoose.model('CompanyAccount', schema, "company-account");

export default CompanyAccount;