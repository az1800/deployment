const User = require("../models/user");
const AccountingFirm = require("../models/accounting_firm")
const bcryptjs = require("bcryptjs")
const Service = require("../models/service")
const Request = require("../models/request")



exports.getAccountFirms = async (req, res, next) => {
  try{
    const AccountFirms = await AccountingFirm.find();
  
    return res.status(200).json({ data:AccountFirms });
  }catch(err){
return res.status(500).json({message:"An error happen!"});
  }

};

  exports.getServices = async (req, res, next) => {
    try {
        const AccountFirmId = req.query.id;
  
       
        if (!AccountFirmId) {
            return res.status(400).json({ message: "Missing required parameter: id" });
        }
  
        const AccountFirm = await AccountingFirm.findById(AccountFirmId)
            .select("services")
            .populate("services");
  
     
        if (!AccountFirm) {
            return res.status(404).json({ message: "Accounting firm not found" });
        }
  
        return res.status(200).json({ data: AccountFirm.services });
  
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
  };
  

  exports.getAccountFirm = async (req, res, next)=>{ //first function
    try{
      const AccountFirmId = req.query.id;
      const AccountFirm = await AccountingFirm.findOne({_id:AccountFirmId})
      return res.status(200).json({ data: AccountFirm });

    }catch(err){
      console.log(err);
      return res.status(500).json({ message: "An error occurred. Please try again." });
    }
  }




  exports.searchForAccountingFirm = async (req, res, next) => {
     // seconed function
    try {
      const searchedItem = req.body.searchedItem;  // Check the name
     
      if (!searchedItem) {
        return res.status(400).json({ message: "Search term is required." });
      }
      
      const words1 = searchedItem.toLowerCase().trim().split(/\s+/);
      const AccountFirms = await AccountingFirm.find();
      
      const data = AccountFirms.filter(i => { 
    return words1.some(word => i.firmName.toLowerCase().trim().split(/\s+/).includes(word)); //the some method will check every word and return boolean
  })

      return res.status(200).json({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occurred. Please try again." });
    }
  };



  exports.createRequest = async (req, res, next) => {
    try{
     const { servicesId, description, budget, deadline} = req.body;
      const senderId = req.session.user._id; 
      
      if(!deadline || !senderId || !servicesId || !description){
        return res.status(400).json({ message: "some felds are missing (senderId, AccountFirmId, services, description.)" });
      }
    
      const service = await Service.findById(servicesId);
      const AccountFirmId = service.firmID;

      const receiver = await User.findOne({accountingFirm:AccountFirmId});
      if(!receiver){
        return res.status(400).json({ message: "can not find the receiverId"});
      }
      const receiverId = receiver._id 
      

      const request = new Request({
        sender:senderId,
        receiver:receiverId,
        budget:budget,
        service:servicesId,
        description:description,
        deadline:deadline,
        
        // the status should be pinding here in this case (I geuess!)
      })

      await request.save();

      const { sendEmail } = require("../utils/email"); // Adjust the path
      await sendEmail(receiver.email, "New Request", "You have a new request. Please check your account.");
      

      return res.status(200).json({ message: "The request submitted !!!" });
    }catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occurred. Please try again." });
    }
  }

  exports.getClientRequests= async (req,res,next) =>{
    try{
        const senderID = req.session.user._id;
        if(!senderID){
            return res.status(400).json({ message:"there is a problem with the session" });
        }
        
        const requests = await Request.find({ sender:senderID })
        .populate("receiver", "name")  
        .populate("service", "name price");

        console.log(requests)

        return res.status(200).json({ message:"the retreving is done succesfuly you can access is with data", data:requests }); 
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
    
}

exports.deleteRequest= async (req,res,next) =>{ // this function will activate when the user click on delete or cancel
  try{
      const {requestID} = req.body; // can be get but dont ask me to protect it later 
      if(!requestID){
          return res.status(400).json({ message:"you gave me an invalid requestID" });
      }

      // if(deletionType == "cancel"){
      //  const request = await Request.findById(requestID).select("receiver").populate("receiver","email");
      // const { sendEmail } = require("../utils/email"); // Adjust the path
      // await sendEmail(request.receiver.email, "Canceled Request", "Sorry the request you got elaer has been canceled by the user");
      // }

      await Request.findByIdAndDelete(requestID);
  
      return res.status(200).json({ message:"the request has been rejected please tell dodo to check the DB" });
  }catch(err){
      console.error(err);
      return res.status(500).json({ message: "An error occurred. Please try again." });
  }
}
exports.getFilterCriteria = async (req, res) => {
  try {
    // ("Starting to fetch filter criteria...");

    // Get distinct values
    const industrySpecializations = await AccountingFirm.distinct(
      "industrySpecialization"
    );
    const cities = await AccountingFirm.distinct("city");
    const ratings = await AccountingFirm.distinct("rating");
    const sortedRatings = ratings.sort((a, b) => b - a);

    // Format response as an array of category objects
    const response = [
      {
        name: "Industry",
        items: [...industrySpecializations.filter(Boolean)],
      },
      {
        name: "Location",
        items: [...cities.filter(Boolean)],
      },
      {
        name: "Size",
        items: ["small", "medium", "large"],
      },
      {
        name: "Rating",
        items: [...sortedRatings.filter(Boolean).map((r) => r.toString())],
      },
    ];

    // ("Final response:", JSON.stringify(response, null, 2));
    res.status(200).json(response);
  } catch (error) {
    // console.error("Detailed error:", error);
    // Return a default array structure on error
    res.status(500).json([
      {
        name: "Industry",
        items: ["All"],
      },
      {
        name: "Location",
        items: ["All"],
      },
      {
        name: "Size",
        items: ["All", "small", "medium", "large"],
      },
      {
        name: "Rating",
        items: ["All"],
      },
    ]);
  }
};

exports.getFilteredResults = async (req, res) => {
  try {
    "Received filter request with body:", req.body;

    const { firmName, selectedFilters } = req.body;
    console.log(firmName, selectedFilters);
    // 'selectedFilters' is an object: { Size: ["small"], location: ..., etc. }
    selectedFilters;
    let matchingFirms;

    // 1. Handle firmName-based search
    if (firmName && firmName.trim() !== "") {
      const words = firmName.toLowerCase().trim().split(/\s+/);
      "finding firms by name " + words;
      const allFirms = await AccountingFirm.find();
      // ("i got this " + allFirms);
      matchingFirms = allFirms.filter((i) =>
        words.some((word) =>
          i.firmName.toLowerCase().trim().split(/\s+/).includes(word)
        )
      );
      // ("the matching firms are " + matchingFirms);
    } else {
      ("finding all firms");
      matchingFirms = await AccountingFirm.find();
    }

    if (selectedFilters && Object.keys(selectedFilters).length > 0) {
      // Build up your query based on the keys in selectedFilters
      const query = {};

      Object.entries(selectedFilters).forEach(([category, values]) => {
        if (values && Array.isArray(values) && values.length > 0) {
          switch (category.toLowerCase()) {
            case "industry":
              query.industrySpecialization = { $in: values };
              break;
            case "location":
              query.city = { $in: values };
              break;
            case "size":
              const sizeConditions = values
                .map((size) => {
                  switch (size.toLowerCase()) {
                    case "small":
                      return { firmSize: { $lt: 10 } };
                    case "medium":
                      return { firmSize: { $gte: 10, $lte: 50 } };
                    case "large":
                      return { firmSize: { $gt: 50 } };
                    default:
                      return {};
                  }
                })
                .filter((c) => Object.keys(c).length > 0);

              if (sizeConditions.length > 0) {
                query.$or = sizeConditions;
              }
              break;
            case "rating":
              query.rating = { $gte: parseFloat(values[0]) };
              break;
            default:
              // If you might have other filters, handle or ignore them here
              break;
          }
        }
      });

      // 3. Filter the matchingFirms array based on `query`

      // matchingFirms = matchingFirms.filter((firm) => {

      // });
      matchingFirms = matchingFirms.filter((firm) => {
        let matches = true;

        if (query.industrySpecialization) {
          matches &&= query.industrySpecialization.$in.includes(
            firm.industrySpecialization
          );
        }
        if (query.city) {
          matches &&= query.city.$in.includes(firm.city);
        }
        if (query.$or) {
          matches &&= query.$or.some((condition) => {
            const { firmSize } = condition;
            if (firmSize.$lt) return firm.firmSize < firmSize.$lt;
            if (firmSize.$gt) return firm.firmSize > firmSize.$gt;
            return (
              firm.firmSize >= firmSize.$gte && firm.firmSize <= firmSize.$lte
            );
          });
        }
        if (query.rating) {
          matches &&= firm.rating >= query.rating.$gte;
        }
        return matches;
      });
    }

    // Sort results by rating
    matchingFirms.sort((a, b) => b.rating - a.rating);
    "these are the matching firms" + matchingFirms;

    return res.status(200).json({
      success: true,
      count: matchingFirms.length,
      data: matchingFirms,
    });
  } catch (error) {
    console.error("Filter error:", error);
    return res.status(500).json({
      success: false,
      message: "Error filtering firms",
      error: error.message,
    });
  }
};


