import mongoose from "mongoose";

const schema = new mongoose.Schema({
  companyName: String,
  logo: String,
  city: String,
  address: String,
  companyModel: String,
  companyEmployees: String,
  workingTime: String,
  WorkOvertime: String,
  email: String,
  phone: String,
  password: String,
  description: String
}, {
  timestamps: true
})

const CompanyAccount = mongoose.model('CompanyAccount', schema, "company-account");

export default CompanyAccount;