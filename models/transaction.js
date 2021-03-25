// Our dependancies
const mongoose = require("mongoose");

// The schema
const Schema = mongoose.Schema;

// Transaction schema
const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const transaction = mongoose.model(`Transaction`, transactionSchema);

module.exports = transaction;
