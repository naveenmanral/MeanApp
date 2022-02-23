const express = require('express');
const hospitals = require('../database/models/hospitals');
const doctors = require('../database/models/doctors');
const treatments = require('../database/models/treatments');
const loginDetails = require('../database/models/loginDetails');
const {verifyToken} = require('../helpers/auth_tokens')


const router = express.Router();
const collectionArray = [doctors, hospitals, treatments];


router.get('/',(req,res)=>{
    res.render('index');
    
});

//  Retrieve all hospitals and their infos
router.get('/hospitals', verifyToken ,(req, res) => {
    hospitals.find({})
        .then(hospitals => res.send(hospitals))
        .catch((error) => console.log(error.message));
});

//  Retrieve all Doctors and their infos
router.get('/doctors', verifyToken,(req, res) => {
    doctors.find({})
        .then(doctors => res.send(doctors))
        .catch((error) => console.log(error.message));
});

//  Retrieve Doctor by ID 
router.get('/doctors/:Id', verifyToken,(req, res) => {
    doctors.findById(req.params.Id)
        .then(doctors => res.status(200).send(doctors))
        .catch((error) => console.log(error.message));
});

//  Retrieve all Treatments 
router.get('/treatments', verifyToken,(req, res) => {
    treatments.find({})
        .then(treatments => res.send(treatments))
        .catch((error) => console.log(error.message));
});


//  Retrieve all admins 
router.get('/admins', (req, res) => {
    console.log(loginDetails);
    loginDetails.find({})
        .then(loginDetails => res.send(loginDetails))
        .catch((error) => console.log(error));
});
//  TextSearch  all collections
router.get('/search/:query', (req, res) => {

    collectionArray.forEach(coll => {
        coll.find({ $text: { $search: req.params.query } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .then(result => {
                //console.log(result.length);

                if (result.length == 0) {                    
                               throw new Error('Not found');                    
                }
                res.status(200).send(result);
            })
            .catch(error => {
                console.log(error);
               // res.status(401).send("Not Found Any Result");
            });
    });
});

module.exports = router;