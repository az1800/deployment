const OTP = require("../models/otp"); 
const User = require("../models/user"); 
const bcrypt = require("bcryptjs");

exports.sendOTP = async (req, res, next) => {console.log("i am here xxx");
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "No account found with this email." });
        }
        console.log(email);

        
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();  // this is string

        
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

       
        await OTP.create({
            email: email,
            code: otpCode,
            expiresAt: expiresAt
        });
        const {sendEmail} = require("../utils/email");
        await sendEmail(email,"AccountLink - Password Reset OTP",`Your OTP code is: ${otpCode}. It will expire in 5 minutes.`
        );
        return res.status(200).json({ message: "OTP sent successfully." });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
};


exports.verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      console.log(email, otp);

      if (!email || !otp) {console.log("nothing");
        return res.status(400).json({ message: "Email and OTP are required." });
      }
  
      const otpRecord = await OTP.findOne({ email: email, code: otp });
      if (!otpRecord) {console.log("invalid");
        return res.status(400).json({ message: "Invalid OTP. Please try again." });
      }
  
      
      if (otpRecord.expiresAt < Date.now()) {console.log("expired");
        return res.status(404).json({ message: "OTP has expired. Please request a new one." });
      }
  
      
      await OTP.deleteOne({ _id: otpRecord._id });
      console.log("good");
      return res.status(200).json({ message: "OTP verified successfully. You can now reset your password." });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred. Please try again." });
    }
  };
  

  exports.resetPassword = async (req, res, next) => {
    try {
      const { email, newPassword, confirmPassword } = req.body;
  
      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }
  
      
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
     
      const hashedPassword = await bcrypt.hash(newPassword, 12);
  
      
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: "Password has been reset successfully." });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred. Please try again." });
    }
  };