const mongoose = require("mongoose");


const ServiceSchema = new mongoose.Schema({
    firmID: { type: mongoose.Schema.Types.ObjectId, ref: "AccountingFirm", required: true },
    name: { type: String, required: true },
    description: String,
    price: Number,
    rating: { type: Number, default: 0 },
    image: {type:String, default:'/uploads/service-images/DefualtServicePicture.png'}
  }, { timestamps: true });
  
  module.exports = mongoose.model("Service", ServiceSchema);
  