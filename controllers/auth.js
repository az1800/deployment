
const User = require("../models/user");
const AccountingFirm = require("../models/accounting_firm")
const bcryptjs = require("bcryptjs")

  

exports.postLogin = async (req, res, next) => {
 
  
  const userType = req.body.userType;
  if(userType === "client"){
    try{
       const {email ,password} = req.body;
    const bussniss = await User.findOne({email:email})
    if(!bussniss || bussniss.userType !== "client"){
      
      return res.status(404).json({ message: "he not signin" });
      
    }
    const doMatch = await bcryptjs.compare(password,bussniss.password);
   
    if(doMatch){
      req.session.user = bussniss;
      req.session.isLoggedIn = true;
      return req.session.save((err)=>{
        
        res.status(200).json({ message: "he is signin correctlly", data:bussniss });
      });
      } 
    return res.status(400).json({ message: "the password is not correct" });
    }catch(err){
      console.log(err)
    }
  } else if (userType === "firm"){
    try{
     const {email ,password} = req.body;
     const accountfirm = await User.findOne({email:email})
     if(!accountfirm || accountfirm.userType !== "firm"){
      return res.status(404).json({ message: "he not signin" });
    }
    const doMatch = await bcryptjs.compare(password,accountfirm.password);
    if(doMatch){
      req.session.user = accountfirm;
      req.session.isLoggedIn = true;
      return req.session.save((err)=>{
        console.log("signin correctlly")
        res.status(200).json({ message: "he is signin correctlly", data:accountfirm });
      });
      } 
    return res.status(400).json({ message: "the password is not correct" });
    }catch(err){
      console.log(err)
    }

    }else{
    try{
      const {email ,password} = req.body;
      const admin = await User.findOne({email:email})
      if(!admin ||admin.userType !== "admin" ){
        return res.status(404).json({ message: "the admin is not regester yet" });
      }
      const doMatch = await bcryptjs.compare(password,admin.password);
        
       
      if(doMatch){
        req.session.user = admin;
        req.session.isLoggedIn = true;
        return req.session.save((err)=>{
          res.status(200).json({ message: "the admin is signin correctlly",data:admin });
        });
        }
        return res.status(400).json({ message: "the password is not correct" });
    }catch(err){
      console.log(err)
    }
  }
    
  }



  

 


 


  exports.postSignup = async (req, res, next) => {

    const type = req.body.type;
    if(type === "client"){
      const {userName,number,email,password} = req.body; // same names as react
      console
      try{
        const user = await User.findOne({email:email})
        if(user){
          //we need the confirmation message
          return res.status(404).json({ message: "User already exists. Redirect to login page." });
        }else{
          const hashedPassword = await bcryptjs.hash(password,12);

          const bussnissUser = new User({
            name:userName,
            phoneNumber:number,
            email:email,
            userType:type,
            password:hashedPassword,
            // the transaction should appear atomaticly
          })
          
          await bussnissUser.save();
          return res.status(200).json({ message: "Signup successful. Redirect to login page." });
        }
      }catch(err){
        console.log(err)
      }  
    }
    else{
      const {address,firmName,commercialRegister,certificationDetails,email,password} = req.body;
      try{
        const user = await User.findOne({email:email})
        //const user2 = await User.findOne({name:firmName})
        if(user ){
          //we need the confirmation message
          if(user)
           return res.status(404).json({ message: "User already exists. Redirect to login page." });
          else{
            return res.status(404).json({ message: "Firm name is already taken." });
          } 
      }else{
        const hashedPassword = await bcryptjs.hash(password,12);
  
        const accountingFirm = new AccountingFirm({
          firmName:firmName,
          certificationDetails:certificationDetails,
          address:address,
          commercialRegister:commercialRegister
        })
  
        await accountingFirm.save();

        const AF= accountingFirm;
  
        const accountingFirmUser = new User({
          name:firmName,
          email:email,
          userType:type,
          password:hashedPassword,
          accountingFirm:AF._id
          // the transaction should appear atomaticly
        })
        
        await accountingFirmUser.save();
        return res.status(200).json({ message: "Signup successful. Redirect to login page." });
      }
    }catch(err){
    console.log(err)
  }  
  }
  }; 
  
  
  
  exports.postLogout =  (req, res, next) => {//console.log("here we are in logout !@");
    req.session.destroy(() =>{
      return res.status(200).json({ message: "logout Success !!!!" });
})
  };



