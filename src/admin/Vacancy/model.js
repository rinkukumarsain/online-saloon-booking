const mongoose = require("mongoose");

const Vacancy = new mongoose.Schema({
 userId: {
  type: mongoose.Types.ObjectId,
 },
 Title: {
  type: String,
  default: null
 },
 NoOfcondi: {
  type: String,
  default: "1"
 },
 category: {
  type: mongoose.Types.ObjectId,
 },
 JobType: {
  type: String,
 },
 BenefitsPerks: {
  type: String
 },
 Qualifications: {
  type: [String],
 },
 WorkExperience: {
  type: String,
  default: ""
 },
 exemptionSalary: {
  type: String,
  default: ""
 },
 description: {
  type: String,
  default: ""
 },
 forService: {
  type: [mongoose.Types.ObjectId],
 },
 city: {
  type: [String]
 },
 requiredStatus: {
  type: String
 }
}, { timestamps: true });


const vacancy = new mongoose.model("vacancy", Vacancy);
module.exports = vacancy;


