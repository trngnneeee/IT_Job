import mongoose from "mongoose";

const schema = new mongoose.Schema({
  companyId: String,
  title: String,
  salaryMin: Number,
  salaryMax: Number,
  level: String,
  workingForm: String,
  technologies: Array,
  description: String,
  images: Array,
  updatedBy: String,
  createdBy: String,
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: String,
  deletedAt: String
}, {
  timestamps: true
})

const CompanyJob = mongoose.model('CompanyJob', schema, "company-job");

export default CompanyJob;