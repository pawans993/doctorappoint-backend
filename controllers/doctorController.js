import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'


const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

    res.status(200).json({ success: true, message: "Availability updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const doctorList=async(req,res)=>{

  try {
    const doctors=await doctorModel.find({}).select(['-password','-email']);

    res.json({success:true,doctors});
    
  } catch (error) {
     console.error(error);
    res.status(500).json({ success: false, message: "Server error" });

  }
}


//api to  doctor login

const loginDoctor=async(req,res)=>{

  try {

    const {email,password}=req.body;

    const doctor=await doctorModel.findOne({email});

    if(!doctor){
      return res.json({success:false,message:'Invalid credential'})
    }

    const isMatch=await bcrypt.compare(password,doctor.password)

    if(isMatch){
      const token=  jwt.sign({id:doctor._id},process.env.JWT_SECRET)
      res.json({
        success:true,
        token 
      })
    }
    else{
      res.json({
        success:false,
        message:'Invalid Credential'
      })
    }

  } catch (error) {
    console.log(error);
    res.json({
      success:false,
      message:'error to Generate the token'
    })


    
  }
}
//Api to get doctor appointments for doctor panel

const appointmentsDoctor=async(req,res)=>{

  try {

    const docId = req.docId;

    const appointments=await appointmentModel.find({docId});

    res.json({
      success:true,
      appointments
    })

  } catch (error) {

    console.log(error);
    res.json({
      success:false,
      message:error.message
    })
    
  }

}

// API TO MAKE APPOINTMENT COMPLETE FOR THE PANEL


const appointmentComplete=async(req,res)=>{

  try {

    const docId=req.docId;
    const {appointmentId}=req.body;

    const appointmentData=await appointmentModel.findById(appointmentId);

    if(appointmentData && appointmentData.docId===docId){

      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
      return res.json({
        success:true,
        message:'appointment completed'
      }
      )
    }
    else{
      return res.json({
        success:false,
        message:'Mark Failed'
      })
    }

  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})


    
  }

}

// API TO CANCEL THE APPOINTMENT

const appointmentCancelled=async(req,res)=>{

  try {

    const docId=req.docId;
    const {appointmentId}=req.body;

    const appointmentData=await appointmentModel.findById(appointmentId);

    if(appointmentData && appointmentData.docId===docId){

      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
      return res.json({
        success:true,
        message:'appointment cancelled'
      }
      )
    }
    else{
      return res.json({
        success:false,
        message:'Cancellation Failed'
      })
    }
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message})
  }

}

// API to get dashboard data for doctor panel

const doctorDashboard=async(req,res)=>{


  try {

    const docId=req.docId
    const appointments=await appointmentModel.find({docId});

    let earning=0;

    appointments.map((item)=>{

      if(item.isCompleted || item.payment){
        earning+=item.amount
      }
    })

    let patients=[];

    appointments.map((item)=>{
      if(!patients.includes(item.userId)){
        patients.push(item.userId);
      }
    })

    const dashData={
      earning,
      appointment:appointments.length,
      patients:patients.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }

    res.json({
      success:true,
      dashData
    })


    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
    


  }
}

// API  to get doctor profile for doctor controller


const doctorProfile=async(req,res)=>{

  try {

    const docId=req.docId
    const profileData=await doctorModel.findById(docId).select('-password')
    res.json({success:true,profileData})

  } catch (error) {
    console.log(error);
    res.json({
      success:false,
      message:error.message
    })
  }
}
// API TO GET DOCTOR PROFILE DATA FROM DOCTOR PANEL

const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: 'Profile Updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};




export{changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appointmentComplete,appointmentCancelled,doctorDashboard,doctorProfile,updateDoctorProfile}
