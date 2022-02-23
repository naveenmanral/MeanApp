const express = require('express');
const nodemailer = require('nodemailer');
const hospitals = require('../database/models/hospitals');
const doctors = require('../database/models/doctors');
const treatments = require('../database/models/treatments');
const loginDetails = require('../database/models/loginDetails');
const {accessToken, refreshToken} = require('../helpers/auth_tokens');
//const {imageUpload} = require('../helpers/upload_Img');
const multer =  require('multer');
const path = require('path');

const routers = express.Router();

//  Saving a hospital and its info
routers.post('/savehospital', (req, res) => {
  (new hospitals({
    'Name': req.body.Name,
    'Description': req.body.Description,
    'Place': req.body.Place,
    'ImageSrc': req.body.ImageSrc
  }))
    .save()
    .then((hospitals) => res.send(hospitals))
    .catch((error) => console.log(error));
});


// Image Upload
const imageStorage = multer.diskStorage({
  destination: './images/doctors/', // Destination to store image 
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
      console.log("hello")
      // file.fieldname is name of the field (image), path.extname get the uploaded file extension
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
      fileSize: 1000000   // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {     // upload only png and jpg format
          return cb(new Error('Please upload a Image'))
      }
      cb(undefined, true)
  }
})  

// For Single image upload
routers.post('/uploadImage', imageUpload.single('image'), (req, res) => {
   res.send(req.file)
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

//  Saving a Doctor and its profile
routers.post('/savedoctor', imageUpload.single('image'),(req, res) => {
  const url = req.protocol + '://' + req.get('host');
   (new doctors({
    'Name': req.body.name,
    'Department': req.body.department,
    'Description': req.body.description,
    'HospitalId': req.body.hospitalId,
    'ImageSrc': url + "/images/doctors/" + req.file.filename
  }))
    .save()
    .then((doctors) => res.send(doctors))
    .catch((error) => console.log(error));
});

//  Saving a treatment with a hospital and doctors
routers.post('/savetreatment', (req, res) => {
  (new treatments({
    'Name': req.body.Name,
    'Department': req.body.Department
  }))
    .save()
    .then((treatments) => res.send(treatments))
    .catch((error) => console.log(error));
});

//  Saving a admin info
routers.post('/registeradmin', (req, res) => {
  (
    loginDetails.findOne({userName:req.body.userName},(err,user) => {
      
      if(!user){
       (new loginDetails(
         {
            'userName': req.body.userName,
            'password': req.body.password,
            'loggedInDateTime': req.body.loggedInDateTime,
            'loggedOutDateTime': req.body.loggedOutDateTime,
            'userRole' : req.body.userRole,
            'registeredDate' : req.body.registeredDate
          }))
    .save()
    .then((loginDetails) => res.send(loginDetails))
    .catch((error) => console.log(error))
        }
    else{
        res.status(401).send('This Email already exist');      
        }    
    }));
  });

//Retreive login details
routers.post('/admin/login',async (req,res,next) => {
  
  try {
    const user = await loginDetails.findOne({userName:req.body.userName}) 
      //console.log(user);
   
          if(!user){
            return res.status(401).send('Invalid User Name');
          }else{

              const isValid = await user.isValidPassword(req.body.password);              
              //console.log('Valid Password', isValid);
              
            if(!isValid){       
               return res.status(401).send('Invalid Password');
            }else{
                const token = await accessToken(user._id);
                const refToken = await refreshToken(user._id)
                res.status(200).send({token, refToken});               
            }
          }
          
  } catch (error) {
    next(error);
    }   
      
    });


// sending contact Form data to email
routers.post('/SendMail', (req, res) => {
  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.USR_NM,
      pass: process.env.PWD
    }
  });

  // Specify what the email will look like
  const mailOpts = {
    from: process.env.USR_NM, // This is ignored by Gmail
    to: 'naveenmanral@gmail.com',
    // cc: 'someEmail@email.com',
    // bcc: 'someEmail@mail.com',
    subject: 'Query from Patient through Contact form',
    // text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    html: `<p><b>Name:- </b> ${req.body.name}<br><b>Phone No.:- </b>${req.body.isdCode} - ${req.body.phone}<br><b>Email:- </b> ${req.body.email} <br> <b>Message:- </b> ${req.body.message}</p>`
  };
 
  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, info) => {
    if (error) {
      //   res.render('contact-failure') // Show a page indicating failure
      console.log(error);
    }
    else {
      //   res.render('contact-success') // Show a page indicating success
      console.log(`Information: ${info.response}`);
    }
  });
  res.end();
});




module.exports = routers;