const Guide = require("../model/guideModel");
const Location = require("../model/locationModel");
const Details = require("../model/guideDetailsModel");
const Orders = require("../model/orderModel");
const Banner = require("../model/bannerModel");
const Review =require('../model/ratingModel')
const Chat=require('../model/chatModel')
const Guest=require('../model/guestModel')
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});
const { response } = require("express");
const { upload } = require("../config/multer");
let otp;
let guidemail;
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

      subject: "to verify your guide detals",
      html:
        "<p>Hi " +
        name +
        " This is your otp for verify your gang accont the otp is " +
        otp +
        " </p>",
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

//  for registration of guide
const GuideRegitration = async (req, res) => {
  try {
    const guideExist = await Guide.findOne({ email: req.body.email });
    if (guideExist) {
      return res
        .status(200)
        .send({ message: "user already exist", success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;
    const randomnumber = Math.floor(Math.random() * 9000) + 1000;
    req.body.otp = randomnumber;
    let newguide = new Guide(req.body);
    console.log(newguide);

    const guide = await newguide.save();
    if (guide) {
      otp = randomnumber;
      console.log(randomnumber);
      guidemail = req.body.email;
      sendVerifyMail(req.body.name, req.body.email, randomnumber);
    }
    res.status(200).send({
      message: "Enter your mail otp for verification",
      success: true,
      data: req.body.email,
    });
  } catch (error) {
    res.status(500).send({ message: "error creating user ", success: false });
  }
};

const login = async (req, res) => {
  try {
    const guide = await Guide.findOne({ email: req.body.email });
    const isVerfied = guide.isVerfied;
    const isBlocked = guide.isBlocked;
    if (!guide) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      guide.password
    );

    if (!passwordMatch) {
      return res
        .status(200)
        .send({ message: "please check your password", success: false });
    } else {
      if (isVerfied) {
        if (isBlocked) {
          res.status(200).send({ message: "Blocked by admin", success: false });
        } else {
          const token = jwt.sign({ id: guide._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });

          res
            .status(200)
            .send({ message: "login successful", success: true, data: token });
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

const otpVerify = async (req, res) => {
  const postotp = req.body.otp;
  console.log(postotp);

  try {
    if (postotp == undefined) {
      res
        .status(200)
        .send({ message: "Please fill the field", success: false });
    } else {
      if (otp == postotp) {
        const verify = await Guide.findOneAndUpdate(
          { email: guidemail },
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

const getUser = async (req, res) => {
  try {
    const guide = await Guide.findOne({ _id: req.body.guide });

    if (!guide) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    } else {
      const banner = await Banner.findOne({});
      res.status(200).send({
        message: "user found",
        success: true,
        data: {
          name: guide.name,
          email: guide.email,
        },
        banner: banner,
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
    const guideexist = await Guide.findOne({ email: req.body.email });
    if (!guideexist) {
      return res.status(200).send({
        message: "enter the correct mail or register first",
        success: false,
      });
    } else {
      const name = "guide";
      guidemail = req.body.email;
      const randomnumber = Math.floor(Math.random() * 9000) + 1000;
      otp = randomnumber;
      console.log(randomnumber);
      sendVerifyMail(name, req.body.email, randomnumber);
      res.status(200).send({
        message: "Eenter your otp and update password",
        success: true,
      });
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
      const updatePassword = await Guide.findOneAndUpdate(
        { email: guidemail },
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
const averagerating=(review)=>{
  const totalrating =review.map(item=>item.rating).reduce((acc,rating)=>acc+rating,0)
    const length=review.length
    const avgrating=totalrating/length
    const roundedNumber = Math.round(avgrating * 2) / 2;
    return roundedNumber
}

const getProfile = async (req, res) => {
  try {
    const guideProfile = await Guide.findById(req.body.guide);
    const guidedetails = await Details.findOne({ guidid: req.body.guide });
    
   const reviews=await Review.find({guideid:req.body.guide})
  
   const average=averagerating(reviews)
  

    res.status(200).send({ data: guideProfile, details: guidedetails,reviews:reviews,average:average});
  } catch (error) {}
};

const getLocation = async (req, res) => {
  try {
    const location = await Location.find({}).sort({});
    const allDistrict2 = [];

    location.forEach((item) => {
      allDistrict2.push(...item.district);
    });

    const allDistrict = allDistrict2.sort();

    res.status(200).send({ data: allDistrict });
  } catch (error) {
    console.log(error);
  }
};

const addDetails = async (req, res) => {
  try {
    const image = req.file.filename;
    await sharp("./uploads/guideId/" + image)
      .resize(1000, 500)
      .toFile("./uploads/GuideID2/" + image);
    const data = await cloudinary.uploader.upload(
      "./uploads/GuideID2/" + image
    );
    const cdnUrl = data.secure_url;

    const guide = await Guide.findOneAndUpdate(
      { _id: req.body.guide },
      { $set: { location: req.body.place } }
    );
    console.log("updatedlocation", guide);
    const detailss = await Details.findOne({ guidid: req.body.guide });

    if (detailss) {
      return res.status(200).send({
        message: "already added please wait for admin confirmation",
        success: false,
      });
    }
    const advance = req.body.amount * 0.25;

    const details = new Details({
      name: req.body.fullname,
      guidid: req.body.guide,
      idnumber: req.body.idnumber,
      idimage: cdnUrl,
      location: req.body.place,
      description: req.body.description,
      amount: req.body.amount,
      advance: advance,
    });
    const datas = await details.save();
    res.status(200).send({ message: "data uploaded", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "something went wrong", error });
  }
};

const editProfile = async (req, res) => {
  console.log("ENTER");
  try {
    if (!req.file) {
      res.status(200).send({ message: "Check the image", success: false });
    }
    const image = req.file.filename;

    await sharp("./uploads/guideId/" + image)
      .resize(1000, 1000)
      .toFile("./uploads/GuideID2/" + image);
    const data = await cloudinary.uploader.upload(
      "./uploads/GuideID2/" + image
    );
    const cdnUrl = data.secure_url;
    if ((!req.body.amount && !req.body.phone && !req.body.name, !cdnUrl)) {
      return res
        .status(200)
        .send({ message: "please edit the form", success: false });
    }
    if (!req.body.amount && !req.body.phone && !req.body.name) {
      const guide = await Guide.findOneAndUpdate(
        { _id: req.body.guide },
        { $set: { profile: cdnUrl } }
      );
    }

    if (req.body.amount && req.body.phone && req.body.name) {
      const advance = req.body.amount * 0.25;
      const details = await Details.findOneAndUpdate(
        { guidid: req.body.guide },
        { $set: { amount: req.body.amount, advance: advance } }
      );
      const guide = await Guide.findOneAndUpdate(
        { _id: req.body.guide },
        {
          $set: { phone: req.body.phone, name: req.body.name, profile: cdnUrl },
        }
      );
      return res
        .status(200)
        .send({ message: "Profile updated", success: true });
    }
    if (!req.body.amount) {
      if (!req.body.name && !req.body.phone) {
        const guide = await Guide.findOneAndUpdate(
          { _id: req.body.guide },
          { $set: { phone: req.body.phone, profile: cdnUrl } }
        );
        return res
          .status(200)
          .send({ message: "Profile updated", success: true });
      } else if (!req.body.phone) {
        const guide = await Guide.findOneAndUpdate(
          { _id: req.body.guide },
          { $set: { name: req.body.name, profile: cdnUrl } }
        );
        return res
          .status(200)
          .send({ message: "Profile updated", success: true });
      } else {
        const guide = await Guide.findOneAndUpdate(
          { _id: req.body.guide },
          {
            $set: {
              name: req.body.name,
              phone: req.body.phone,
              profile: cdnUrl,
            },
          }
        );
        return res
          .status(200)
          .send({ message: "Profile updated", success: true });
      }
    } else {
      const advance = req.body.amount * 0.25;
      if (!req.body.name) {
        const guide = await Guide.findOneAndUpdate(
          { _id: req.body.guide },
          { $set: { phone: req.body.phone, profile: cdnUrl } }
        );
        const details = await Details.findOneAndUpdate(
          { guidid: req.body.guide },
          { $set: { amount: req.body.amount, advance: advance } }
        );

        return res
          .status(200)
          .send({ message: "Profile updated", success: true });
      } else if (!req.body.phone) {
        const guide = await Guide.findOneAndUpdate(
          { _id: req.body.guide },
          { $set: { name: req.body.name, profile: cdnUrl } }
        );
        const details = await Details.findOneAndUpdate(
          { guidid: req.body.guide },
          { $set: { amount: req.body.amount, advance: advance } }
        );
        return res
          .status(200)
          .send({ message: "Profile updated", success: true });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

const getOrder = async (req, res) => {

  try {
    
    const order = await Orders.find({ guideid: req.body.guide });
  
    if (order) {
      res.status(200).send({ data: order, success: true });
    } else {
      res.status(200).send({ message: "no oreder found" });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
};
const sendComplete=async(req,res)=>{
  
try {
  const random = Math.floor(Math.random() * 9000) + 1000;
  const updated=await Orders.findOneAndUpdate({_id:req.body.id},{$set:{completeCode:random}},{new:true})
  if(updated){
    res.status(200).send({message:'code send to guest',success:true,data:updated._id})
  }else{
    res.status(200).send({message:"try again",success:false})
  }
  
} catch (error) {
  req.status(500).send({message:"try again"})
}
  
}
const checkCode=async(req,res)=>{
  try {
    const findOrder=await Orders.findOne({_id:req.body.data})
   
    if(findOrder.completeCode==req.body.otp){
      const codeUpdate=await Orders.findOneAndUpdate({_id:req.body.data},{$set:{completeCode:null,orderStatus:"Completed"}},{new:true})
      
      
      res.status(200).send({message:"orderCompleted",success:true})
    }
    else{
      res.status(200).send({message:"Enter the correct otp",success:false})
    }
  } catch (error) {
    res.status(500).send({message:"try again"})
    
  }
}
const getorders=async(req,res)=>{
  try {
    const orders=await Orders.find({guideid:req.body.guide})
    
    const ordercount=orders.length
    const completed=orders.filter(order=>order.orderStatus=="Completed").length
    const totalamount=orders.filter(order=>order.orderStatus=='Completed').reduce((total,order)=>total+order.amount,0)

    if(orders){
      res.status(200).send({success:true,ordercount,completed,totalamount,orders})
    }
    else{
      res.status(200).send({success:false})
    }

  } catch (error) {
    res.status(500).send(error)
    
  }
}
const getsenderId=async(req,res)=>{
  try {
    res.status(200).send({id:req.body.guide,success:true})
    
  } catch (error) {
    
  }
}
const chatHistory=async(room,message,author)=>{

  const roomexist=await Chat.findOne({chatRoom:room})
  console.log("room nd")

  if(roomexist){
  const chat=  await Chat.findOne(({chatRoom:room}))
    const id=chat._id
    const chatUpdate = await Chat.findByIdAndUpdate(
      id, // Replace 'id' with the actual _id of the document you want to update
      {
        $push: {
          chathistory: {
            author: author,
            message: message,
            time: new Date(),
          },
        },
      },
      { new: true }
    );
    
  }
  else{
    const savechat=new Chat({
      chatRoom:room,
      chathistory:[
        {
          author:author,
          message:message,
          time:new Date()
        }
      ]
    })
    await savechat.save()

  }
}
const getChat=async(req,res)=>{
  const order=await Orders.findOne({_id:req.body.data.id}) 
  const name=order.guest

 const chathistory= await Chat.findOne({chatRoom:req.body.data.id})
 const chat=chathistory?.chathistory
 const senderchats=chat?.filter((item)=>item.author!==req.body.data.userid)
 let sendeid
 if (senderchats) {
    sendeid=senderchats[0]?.author   
 }

 if(chathistory){
  res.status(200).send({ chat,name,success:true})
 }
 else{
  res.status(200).send({name,success:false})

 }
}

module.exports = {
  GuideRegitration,
  login,
  otpVerify,
  getUser,
  resetPassword,
  resetOtp,
  getProfile,
  getLocation,
  addDetails,
  editProfile,
  getOrder,
  sendComplete,
  checkCode,
  averagerating,
  getorders,
  getsenderId,
  chatHistory,
  getChat
};
