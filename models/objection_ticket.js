const mongoose = require("mongoose");

const ObjectionTicketSchema = new mongoose.Schema(
  {
    clientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueTitle: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const predefinedTitles = [
            "Service Quality Concerns",
            "Communication Issues",
            "Deadline Not Met",
            "Incorrect Information",
            "Documentation Issues",
            "Professional Conduct",
            "Unauthorized Changes",
            "Contract Terms Violation",
            "Data Privacy Concerns",
            "Technical Issues",
            "Payment Dispute",
            "Customer Service Issue",
            "Other",
          ];
          // Allow either predefined titles or custom titles when "Other" is selected
          return predefinedTitles.includes(v) || this.customIssueTitle;
        },
        message:
          'Issue title must be from the predefined list or have a custom title when "Other" is selected',
      },
    },
    customIssueTitle: {
      type: String,
      required: function () {
        return this.issueTitle === "Other";
      },
    },
    issueDescription: String,
    attachments: [String],
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "under-review", "resolved"],
      default: "pending",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    budget: Number,
    originalDescription: String, // Original request description
    resolution: { type: String, default: null },
  },
  { timestamps: true }
);

ObjectionTicketSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const request = await mongoose.model("Request").findById(this.requestId);
      if (request) {
        this.sender = request.sender;
        this.receiver = request.receiver;
        this.service = request.service;
        this.budget = request.budget;
        this.originalDescription = request.description;
      }
    } catch (error) {
      next(error);
    }
  }
  next();
});
module.exports = mongoose.model("ObjectionTicket", ObjectionTicketSchema);

// client id ref

/*  // suggestion: change th schema to the below one
const mongoose = require("mongoose");

const ObjectionTicketSchema = new mongoose.Schema({
    requestId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Request", 
        required: true 
    },
    // Automatically populated from Request
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    service: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Service"
    },
    budget: Number,
    originalDescription: String, // Original request description
    
    // Objection fields
    objectionDescription: { 
        type: String, 
        required: true 
    },
    attachments: [String],
    status: { 
        type: String, 
        enum: ["pending", "under-review", "resolved"], 
        default: "pending" 
    },
    resolution: {
        response: { type: String, default: null },
            }
}, { timestamps: true });


ObjectionTicketSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const request = await mongoose.model('Request').findById(this.requestId);
            if (request) {
                this.sender = request.sender;
                this.receiver = request.receiver;
                this.service = request.service;
                this.budget = request.budget;
                this.originalDescription = request.description;
            }
        } catch (error) {
            next(error);
        }
    }
    next();
});

module.exports = mongoose.model("ObjectionTicket", ObjectionTicketSchema);  */
