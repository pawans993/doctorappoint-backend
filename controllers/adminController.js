import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js';

const addDoctors = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

  if (!imageFile) {
  return res.status(400).json({
    success: false,
    message: 'Image file is missing',
  });
}
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.status(400).json({
        success: false,
        message: 'Missing details'
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a strong password'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image"
    });

    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      image: imageUrl, // ✅ added
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save(); // ✅ awaited

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
    });

  } catch (error) {
    console.error('Add Doctor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error while adding doctor'
    });
  }
};



const loginAdmin=async(req,res)=>{
  try {

    const {email,password}=req.body;

    if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
      const token=jwt.sign(email+password,process.env.JWT_SECRET);
      res.json({
        success:true,
        token
      })
    }
    else{
      res.json({
        success:false,
        message:'Invalid Credentials'
      })
    }
  } catch (error) {
    console.log(error);
    res.send({
      success:false,
      message:error.message
    })
  }
}

// API to get all doctors list for admin panel

const allDoctors=async(req,res)=>{
  
  try {
    const doctors=await doctorModel.find({}).select('-password')
    res.json({
      success:true,
      doctors
    })
  } catch (error) {
    console.log(error);
    res.json({
      success:false,
      message:error.message,
    })
    
  }
}


// API TO GET ALL APPOINTMENTS LIST

const appointmentsAdmin=async(req,res)=>{
  try {
    const appointments=await appointmentModel.find({});
    res.json({success:true,appointments})

  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }

}

// API TO CANCELL THE APPOINYMENT

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);


    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment cancell" });
  } catch (error) {
    console.log(error);
    res.json({
      success:false,
      error
    })
  }
};

// API TO GET DASHBOARD DATA FOR ADMIN PANEL

const adminDashboard=async(req,res)=>{

  try {

    const doctors=await doctorModel.find({});
    const user =await userModel.find({});
    const appointments=await appointmentModel.find({});

    const dashData={
      doctors:doctors.length,
      appointments:appointments.length,
      patients:user.length,
      latestAppointments:appointments.reverse().slice(0,5)
      }
      
      res.json({
        success:true,
        dashData})
    
  } catch (error) {
    console.log(error);
    
  }

}



export {addDoctors,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}