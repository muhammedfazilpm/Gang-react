const mongoose = require("mongoose");

const guestSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    isBlocked:{
      type:Boolean,
      default:false
    },
    image: {
      type: String,
    },
    otp: Number,
  },
  {
    timestamps: true,
  }
);

const guestModel = mongoose.model("guest", guestSchema);
module.exports = guestModel;
