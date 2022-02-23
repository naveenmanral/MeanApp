const express = require('express');
const hospitals = require('../database/models/hospitals');
const doctors = require('../database/models/doctors');
const treatments = require('../database/models/treatments');

const routers = express.Router();


// Update a hospital and its info
routers.put('/updateHospital/:hospitalID', (req, res) => {
    hospitals.findOneAndUpdate({_id: req.params.hospitalID},{$set:req.body})
    .then((hospitals)=>res.send(hospitals))
    .catch((error) => console.log(error));
});

// Update a Doctor and his info
routers.put('/updateDoctor/:doctorID', (req, res) => {
    doctors.findOneAndUpdate({_id: req.params.doctorID},{$set:req.body})
    .then((doctors)=>res.send(doctors))
    .catch((error) => console.log(error));
});

// Update a Treatment 
routers.put('/updateTreatment/:treatmentID', (req, res) => {
    treatments.findOneAndUpdate({_id: req.params.treatmentID},{$set:req.body})
    .then((treatments)=>res.send(treatments))
    .catch((error) => console.log(error));
});

module.exports = routers;