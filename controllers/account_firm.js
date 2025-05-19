const User = require("../models/user");
const AccountingFirm = require("../models/accounting_firm")
const Service = require("../models/service")
const Request = require("../models/request")
const Conversation = require("../models/conversation")
const bcryptjs = require("bcryptjs")
const path = require('path');
const fs = require("fs");


exports.getAccountFirm = async (req, res, next)=>{ //first function
    try{
      const {AccountFirmId} = req.body;
      const AccountFirm = await AccountingFirm.findOne({_id:AccountFirmId})
      return res.status(200).json({ data: AccountFirm });

    }catch(err){
      console.log(err);
      return res.status(500).json({ message: "An error occurred. Please try again." });
    }
  }



exports.getAccountFirmUser = async (req, res, next)=>{
    try{
        const userId= req.session.user._id;
        
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: No user session found please login again." });
        }
        const user = await User.findById(userId).populate("accountingFirm");
        const email = user.email;
        //const image = user.accountingFirm.image;
        const description = user.accountingFirm.description;
        const firmName = user.accountingFirm.firmName;


      return res.status(200).json({ email:email, firmName:firmName, description:description  });

    }catch(err){
      console.log(err);
      return res.status(500).json({ message: "An error occurred. Please try again." });
    }
  }


  exports.updateAccountFirm = async (req, res, next) => {
    const { name, newEmail, currentPassword, newPassword, description } = req.body;
    let imageUrl;

    try {
      const userId = req.session.user._id;
  
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized. No user session found." });
        }

        
        const user = await User.findById(userId).populate("accountingFirm");

        // Handle image upload
        
        if (req.file) {
            imageUrl = `/uploads/profile-images/${req.file.filename}`; // Store file path
        } else {
            imageUrl = user.accountingFirm.image; // Keep existing image if not updated
        }
   
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            return res.status(400).json({ message: "The email has already been taken" });
        }
        

        user.name = name;
        user.email = newEmail;

        if (currentPassword && newPassword) {
            const doMatch = await bcryptjs.compare(currentPassword, user.password); 
        if (doMatch) {
            user.password = await bcryptjs.hash(newPassword, 12);
        } else {
            return res.status(400).json({ message: "The current password is incorrect" });
        }
        }
        


        
            await AccountingFirm.findByIdAndUpdate(user.accountingFirm._id, {
                firmName: name,
                image: imageUrl,
                description: description
            },{ new: true });
        

        await user.save();

        return res.status(200).json({ message: "Your account has been updated successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
};

exports.addService = async (req, res, next) => {
    const { firmID, name, description, price } = req.body;
    let imageUrl = "/uploads/service-images/DefaultServicePicture.png"; // Default image path

    try {
       
        if (req.file) {
            imageUrl = `/uploads/service-images/${req.file.filename}`;
        }
        const service = new Service({
            firmID: firmID,
            name: name,
            description: description,
            price: price,
            image: imageUrl
        });

        await service.save();

        // await AccountingFirm.findByIdAndUpdate(
        //     firmID, 
        //     { $push: { services: service._id } }, 
        //     { new: true }
        // ); 

        // if the 6 lines down there is not working

       

        const AF = await AccountingFirm.findById(firmID);
        if (!AF) {
            return res.status(404).json({ message: "Accounting Firm not found" });
        }
        // AF.services = [...AF.services,service._id];
        AF.services.push(service._id);
        await AF.save();

        return res.status(200).json({ message: "Service added successfully!" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
};

//reconsider the if situations 
exports.deleteService = async (req, res, next) => {console.log("i enter the fun in back");
    try {
        const serviceID = req.query.id;
console.log("this the id !!!! = "+serviceID);
        if (!serviceID) {
            return res.status(400).json({ message: "An error occurred. I didn't get the service ID." });
        }

        const service = await Service.findById(serviceID);
        if (!service) {
            return res.status(400).json({ message: "An error occurred. There is no service with this ID in the database." });
        }

        const firmID = service.firmID;

        await Service.findByIdAndDelete(serviceID);

      
        await AccountingFirm.findByIdAndUpdate(
            firmID,
            { $pull: { services: serviceID } },
            { new: true }
        );

        return res.status(200).json({ message: "Service deleted successfully!" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
};
exports.getService = async (req, res, next)=>{
    try{
       const serviceId = req.query.id;
       const service = await Service.findById(serviceId) 
       // const service = await Service.findOne({_id:serviceId})
       console.log(service);
       return res.status(200).json({ data:service });

    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
    }

    exports.updateService = async (req, res, next)=>{
        const { serviceID, name, description, price } = req.body;
        let imageUrl;
       
        try{
            const SV = await Service.findById(serviceID);
            if (!SV) {
                return res.status(404).json({ message: "Service not found." });
            }
    
         // Check if a new image is uploaded
         if (req.file) {
            // Save new image path
            imageUrl = `/uploads/service-images/${req.file.filename}`;
    
            // Get old image path
            const oldImagePath = SV.image;
    
            // Ensure we are not deleting the default image
            if (oldImagePath !== "/uploads/service-images/DefaultServicePicture.png") {
                const fullPath = path.join(__dirname, "..", oldImagePath);
                
                // Check if the file exists before deleting
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath); // Delete the file
                }
            }
        }else{
            imageUrl = SV.image;
        }
    
        await Service.findByIdAndUpdate(serviceID,{
             name:name,
            description:description,
            price:price,
            image:imageUrl
        },{new:true})
    
        return res.status(200).json({ message:"service is updated successfully" }); 
        }catch(err){
            console.error(err);
            return res.status(500).json({ message: "An error occurred. Please try again." });
        }}
    
        exports.getFirmRequests= async (req,res,next) =>{
            try{
                const firmID = req.session.user._id;
                if(!firmID){
                    return res.status(400).json({ message:"there is a problem with the session" });
                }
                console.log(firmID);

                const requests = await Request.find({ receiver: firmID, status: "pending" })
                .populate("sender", "name")  
                .populate("service", "name price");
    
                console.log(requests)
       
                return res.status(200).json({ message:"the retreving is done succesfuly you can access is with data", data:requests }); 
            }catch(err){
                console.error(err);
                return res.status(500).json({ message: "An error occurred. Please try again." });
            }}

            exports.acceptRequest = async (req, res, next) => {
                try {
                  const { requestID } = req.body;
                  if (!requestID) {
                    return res.status(400).json({ message: "You gave me an invalid requestID" });
                  }
              
                  const request = await Request.findById(requestID).populate("receiver", "accountingFirm").populate("sender", "email");
                  if (!request) {
                    return res.status(404).json({ message: "Request not found." });
                  }
              
                  request.status = "accepted";
                  await request.save();
              
                  const conversation = new Conversation({
                    client: request.sender,
                    firm: request.receiver._id,
                    firmID: request.receiver.accountingFirm,
                    request: request._id
                  });
              
                  await conversation.save();
              


                  const { sendEmail } = require("../utils/email"); // Adjust the path
                  await sendEmail(request.sender.email, "Request Accepted", "You have a accepted request. Please check your account.");


                  return res.status(200).json({ message: "The request has been accepted. Please tell Dodo to check the DB." });
              
                } catch (err) {
                  console.error(err);
                  return res.status(500).json({ message: "An error occurred. Please try again." });
                }
              };
              

        exports.rejecteRequest= async (req,res,next) =>{
            try{
                const {requestID,rejectionMessage} = req.body;
                if(!requestID){
                    return res.status(400).json({ message:"you gave me an invalid requestID" });
                }
    
                const request = await Request.findById(requestID).populate("sender", "email");
                request.status = "rejected";
                request.rejectionMessage = rejectionMessage;
                await request.save();

                const { sendEmail } = require("../utils/email"); // Adjust the path
                  await sendEmail(request.sender.email, "Request Rejected", "Your request has been rejected. Please check your account to see the reasons.");
            
                return res.status(200).json({ message:"the request has been rejected please tell dodo to check the DB" });
            }catch(err){
                console.error(err);
                return res.status(500).json({ message: "An error occurred. Please try again." });
            }
        }