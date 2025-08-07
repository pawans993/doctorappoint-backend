import {v2 as cloudinary} from 'cloudinary'


const connectCloudinary=()=>{
    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_SECRET_KEY
    })
}

  // const uploadResult = await cloudinary.uploader
  //      .upload(
  //          'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
  //              public_id: 'shoes',
  //          }
  //      )
  //      .catch((error) => {
  //          console.log(error);
  //      });
    
  //   console.log(uploadResult);

  export default connectCloudinary;