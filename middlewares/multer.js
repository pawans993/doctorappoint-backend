import multer from "multer";

const storage=multer.diskStorage({
  filename:function(req,file,callback){
    callback(null,file.originalname)
  }
})

const upload=multer({storage})

export default upload;


// // middlewares/multer.js
// import multer from 'multer';
// import fs from 'fs';

// // Ensure the uploads folder exists
// const uploadPath = 'uploads/';
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
// }

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // safer unique name
//   }
// });

// const upload = multer({ storage });

// export default upload; this is the write way to upload the file in the multer