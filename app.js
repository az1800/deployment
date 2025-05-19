const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const multer = require("multer");
const socketService = require("./socket.io"); // ✅ correct

const User = require("./models/user");
const authRoutes = require("./routes/auth");
const faqRoutes = require("./routes/faq");
const clientRoutes = require("./routes/client");
const frimRoutes = require("./routes/account_firm");
const chatRoutes = require("./routes/direct_chat");
const objectionTicketRoutes = require("./routes/objection_ticket"); //new
const adminRoutes = require("./routes/admin"); //new
const resetPasswordRoutes = require("./routes/reset_password");
const couponRoutes = require("./routes/coupon"); //new
const escrowRoutes = require("./routes/escrow"); //new
const transactionRoutes = require("./routes/transaction");
const ratingRoutes = require("./routes/rating");
const app = express();
const store = new MongoDBStore({
  uri: "mongodb+srv://Alwaleed991:MAAA@graduationprojectcluste.de2ve.mongodb.net/AccountLink?retryWrites=true&w=majority&appName=GraduationProjectCluster",
  collection: "sessions",
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: "JFUC8EJ34A",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/account_firm", frimRoutes);
app.use("/api/direct_chat", chatRoutes);
app.use("/api/objection-tickets", objectionTicketRoutes); //new
app.use("/api/admin", adminRoutes); //new
app.use("/api/resetPassword", resetPasswordRoutes); //new
app.use("/api/coupons", couponRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ratings", ratingRoutes);
resetPasswordRoutes;
// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
socketService.init(server);

mongoose
  .connect(
    "mongodb+srv://Alwaleed991:MAAA@graduationprojectcluste.de2ve.mongodb.net/AccountLink?retryWrites=true&w=majority&appName=GraduationProjectCluster"
  )
  .then((result) => {
    // Use server.listen instead of app.listen
    server.listen(5000);
    console.log("Connected to MongoDB and started server on port 5000");
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "src/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "src/build", "index.html"));
  });
}
