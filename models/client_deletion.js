// const mongoose = require("mongoose");

// const ClientDeletionSchema = new mongoose.Schema(
//   {
//     clientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },
//     clientEmail: {
//       type: String,
//       required: true,
//     },
//     reason: {
//       type: String,
//       required: true,
//       enum: [
//         "account_inactive",
//         "violation_of_terms",
//         "user_requested",
//         "fraudulent_activity",
//         "duplicate_account",
//         "other",
//       ],
//     },
//     additionalNotes: String,
//     deletedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     clientData: {
//       name: String,
//       phoneNumber: String,
//       transactions: [
//         {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Transaction",
//         },
//       ],
//       accountingFirm: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "AccountingFirm",
//       },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("ClientDeletion", ClientDeletionSchema);
const mongoose = require("mongoose");

const clientDeletionSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "account_inactive",
        "violation_of_terms",
        "user_requested",
        "fraudulent_activity",
        "duplicate_account",
        "other",
      ],
    },
    additionalNotes: {
      type: String,
      default: "",
    },
    deletedBy: {
      type: mongoose.Schema.Types.Mixed, // Changed from ObjectId to Mixed to allow both ObjectId and string
      ref: "User",
      required: true,
    },
    clientData: {
      name: String,
      phoneNumber: String,
      transactions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
      accountingFirm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AccountingFirm",
      },
    },
  },
  { timestamps: true }
);

const ClientDeletion = mongoose.model("ClientDeletion", clientDeletionSchema);

module.exports = ClientDeletion;
