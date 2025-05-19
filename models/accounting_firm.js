const mongoose = require("mongoose");

const AccountingFirmSchema = new mongoose.Schema({
    firmName: { type: String, required: true ,unique: true},
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    industrySpecialization: String,//to be considred 
    firmSize: Number,//to be considred 
    rating: { type: Number, default: 0 },
    city: { type: String, default: "" }, // new
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    address: String,// it was in the user model
    certificationDetails: String, // it was in the user model
    commercialRegister:String,// it was in the user model
    description:{type:String , default:"This your description"},
    image:{type:String, default:"/uploads/profile-images/DefualtUserPicture.jpg"}
    //transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }]
  }, { timestamps: true });
  
  module.exports = mongoose.model("AccountingFirm", AccountingFirmSchema);