const multer =  require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({destination: './images/doctors/',
filename:(req,file,cb)=>{
    cb(null,file.image + '_' + Date.now() + path.extname(file.originalname))
}});

const imageUpload = multer({
    
    storage: imageStorage,
    limits: {
      fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
       console.log("testing 2")
     cb(undefined, true);
  }
});

module.exports = {imageUpload};