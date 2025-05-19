const express = require('express');
const multer = require("multer");
const accountFirmController = require('../controllers/account_firm');
const path = require("path");
const router = express.Router();
const {isAuthenticated, isAccountingFirm, isFirmOwner} = require("../controllers/access_control")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "uploads/";

        // Access imageType from the headers
        const imageType = req.headers.imagetype; // Use lowercase for header keys

        // Determine the folder based on imageType
        if (imageType === "profile") {
            folder += "profile-images/";
        } else if (imageType === "service") {
            folder += "service-images/";
        } else {
            folder += "others/"; // Default folder for other types
        }

        

        // Pass the folder path to the callback
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        // Generate a unique filename with the original extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"), false);
    }
};

// Apply image filter only for this route
const uploadImage = multer({ storage: storage, fileFilter: imageFilter });








router.post("/update-account-firm",isAuthenticated, isAccountingFirm, (req, res, next) => { 
    uploadImage.single("image")(req, res, (err) => { // uploadImage.single("image") is function and req, res, (err) are the parameter of the function
        if (err) {console.log(err.message);
            // this is the err we set in the filter
            return res.status(400).json({ message: err.message });
        }
        next(); // Move to the controller if no error
    });
}, accountFirmController.updateAccountFirm);

//uploadImage.single("image") this thing will take the image and give it a new name and apply the fillter for it and store it in the distination and set it in req.file so you can use it in the controller function










router.post("/update-service",isAuthenticated, isAccountingFirm,(req, res, next) =>{
    uploadImage.single("image")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next(); 
    });
},accountFirmController.updateService )



router.post("/firm-post-service",isAuthenticated, isAccountingFirm,(req, res, next) =>{
    uploadImage.single("image")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next(); 
    });
},accountFirmController.addService )

router.post("/firmProfile",isAuthenticated, isAccountingFirm, isFirmOwner,accountFirmController.getAccountFirm);
router.get("/delete-service",accountFirmController.deleteService);
router.get("/getAccountFirmService",accountFirmController.getService);
router.post("/getAccountFirmUser",isAuthenticated, isAccountingFirm,accountFirmController.getAccountFirmUser);// this is not going to work !
router.post("/getAccountFirmRequests",isAuthenticated, isAccountingFirm, accountFirmController.getFirmRequests);
router.post("/acceptRequest",isAuthenticated, isAccountingFirm, accountFirmController.acceptRequest);
router.post("/rejectRequest",isAuthenticated, isAccountingFirm, accountFirmController.rejecteRequest);

module.exports = router;