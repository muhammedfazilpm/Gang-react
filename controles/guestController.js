const Guest = require("../model/guestModel");
const Location = require("../model/locationModel");
const Guidedetails = require("../model/guideDetailsModel");
const Order = require("../model/orderModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Razorpay=require('razorpay')
require("dotenv").config();

const jwt = require("jsonwebtoken");

var instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret
});

let guestmail;
let otp;
let guide;

// to send the mail
const sendVerifyMail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
      requireTLS: true,
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });
    const mailOption = {
      from: "globalcycle12@gmail.com",
      to: email,
      subject: "to verify your detals",
      html:
        "<p>Hi " +
        name +
        " This is your otp to verify your gang accont the otp is " +
        otp +
        "</p>",
    };
    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email has been send", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

const registeration = async (req, res) => {
  try {
    const guestExist = await Guest.findOne({ email: req.body.email });
    console.log(guestExist);
    if (guestExist) {
      return res
        .status(200)
        .send({ message: "user already exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;
    const newguest = new Guest(req.body);
    const guest = await newguest.save();
    if (guest) {
      const randomnumber = Math.floor(Math.random() * 9000) + 1000;
      otp = randomnumber;
      console.log(randomnumber);
      guestmail = req.body.email;
      sendVerifyMail(req.body.name, req.body.email, randomnumber);
    }
    res
      .status(200)
      .send({ message: "Enter your mail otp for verification", success: true });
  } catch (error) {
    res.status(500).send({ message: "error creating user ", success: false });
  }
};

const otpVerify = async (req, res) => {
  const postotp = req.body.otp;

  try {
    if (otp == undefined) {
      res
        .status(200)
        .send({ message: "enter the correct otp", success: false });
    } else {
      if (otp == postotp) {
        const verify = await Guest.findOneAndUpdate(
          { email: guestmail },
          { $set: { isVerfied: true } }
        );
        res.status(200).send({ message: "verified your email", success: true });
      } else {
        res
          .status(200)
          .send({ message: "enter the correct otp", success: false });
      }
    }
  } catch (error) {
    res.status(500).send({ message: error, success: false });
  }
};

const login = async (req, res) => {
  try {
    const guest = await Guest.findOne({ email: req.body.email });
    console.log(guest);
    const isVerfied = guest.isVerfied;
    const isBlocked = guest.isBlocked;
    if (!guest) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      guest.password
    );
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res
        .status(200)
        .send({ message: "please check your password", success: false });
    } else {
      if (isVerfied) {
        if (isBlocked) {
          res.status(200).send({ message: "You are Blocked", success: false });
        } else {
          const guesttoken = jwt.sign(
            { id: guest._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );

          res.status(200).send({
            message: "login successful",
            success: true,
            data: guesttoken,
          });
        }
      } else {
        res
          .status(200)
          .send({ message: "please verify your email id", success: false });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "error in login", success: false, error });
  }
};
const getUser = async (req, res) => {
  console.log(req.body.guest);
  try {
    const guest = await Guest.findOne({ _id: req.body.guest });

    if (!guest) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    } else {
      res.status(200).send({
        message: "user found",
        success: true,
        data: {
          name: guest.name,
          email: guest.email,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "error geting guideinfo", success: false, error });
  }
};
const resetPassword = async (req, res) => {
  try {
    const guestExist = await Guest.findOne({ email: req.body.email });
    if (!guestExist) {
      return res.status(200).send({
        message: "enter the correct mail or register first",
        success: false,
      });
    } else {
      const name = "guest";
      guestmail = req.body.email;
      const randomnumber = Math.floor(Math.random() * 9000) + 1000;
      console.log(randomnumber);
      otp = randomnumber;

      sendVerifyMail(name, req.body.email, randomnumber);
      res
        .status(200)
        .send({ message: "Enter your otp and update password", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const resetOtp = async (req, res) => {
  try {
    if (otp != req.body.otp) {
      return res
        .status(200)
        .send({ message: "enter the correct otp", success: false });
    } else {
      if (req.body.password1 != req.body.password2) {
        return res
          .status(200)
          .send({ message: "check the 2 passwords", success: false });
      }
      const salt = await bcrypt.genSalt(10);
      req.body.password1 = await bcrypt.hash(req.body.password2, salt);
      const updatePassword = await Guest.findOneAndUpdate(
        { email: guestmail },
        { $set: { password: req.body.password1, isVerfied: true } }
      );
      res
        .status(200)
        .send({ message: "your password is updated", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
const getlocations = async (req, res) => {
  try {
    const locations = await Location.find({}).sort({});
    const allDistrict2 = [];
    locations.forEach((item) => {
      allDistrict2.push(...item.district);
    });
    const allDistrict = allDistrict2.sort();
    res.status(200).send({ data: allDistrict });
  } catch (error) {
    res.status(500).send({ data: error });
  }
};
const postOrder = async (req, res) => {
  console.log("hii");
  try {
    console.log(req.body);
    console.log(req.body.guest);
  } catch (error) {}
};
const saveDetails = async (req, res) => {
  console.log("to save details");
  try {
    guide = req.body.data;

    const details = await Guidedetails.findOne({ guidid: guide._id });

    compinedatas = { ...guide, ...details };

    if (guide) {
      res.status(200).send({ data: compinedatas, success: true });
    } else {
      res.status(200).send({ success: false });
    }
  } catch (error) {
    res.status(500).send({ success: false });
  }
};
const bookDeal = async (req, res) => {
 const guide=req.body.data
 const date=req.body.formData.date
 const guides=await Guidedetails.findOne({guidid:guide})
 const guest =await Guest.findOne({_id:req.body.guest})
 const sameBooking=await Order.findOne({guideid:guide,dateofbook:date})
     if(sameBooking){
      return res.status(200).send({message:"The guide has a booking ",success:false})
     }
  try {
    const order = new Order({
      guestid: req.body.guest,
      guest:guest.name,
      guide:guides.name,
      guideid: req.body.data,
      location: req.body.formData.location,
      dateofbook: req.body.formData.date,
      numberofguest: req.body.formData.numberOfPersons,
      advance:guides.advance,
      amount:guides.amount
    });
    const orders = await order.save();
  

    if (orders) {
      res
        .status(200)
        .send({ message: "pay for confirm booking", success: true,data:orders});
    } else {
      res.status(200).send({ message: "something went wrong", success: false });
    }
  } catch (error) {
    res.status(500).send({ message: error, success: false });
  }
};
const paymentUpdate=async(req,res)=>{
  const id=req.body.order._id
  const paymentid=req.body.payment.razorpay_payment_id
  console.log(paymentid)
  try {
    const updateOrder=await Order.findOneAndUpdate({_id:id},{$set:{paymentstatus:"paid",paymentid:paymentid}})
   
     if(updateOrder){
      res.status(200).send({message:"Payment success full",success:true})
     }else{
      res.status(200).send({message:'something wrong try after sometime',success:false})
     }
    
  } catch (error) {
    res.status(500).send({error})
  }
}

const getOrders=async(req,res)=>{
    try {
      const orders=await Order.find({guestid:req.body.guest})
      if(orders){
        res.status(200).send({data:orders,success:true})
      }
      else{
        res.status(400).send({message:"some thing went wrong"})
      }
    } catch (error) {
      res.status(500).send({error})
    }
}
module.exports = {
  registeration,
  otpVerify,
  login,
  getUser,
  resetPassword,
  resetOtp,
  getlocations,
  postOrder,
  saveDetails,
  bookDeal,
  paymentUpdate,
  getOrders
};
