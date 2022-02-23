const express = require('express');
const hospitals = require('../database/models/hospitals');
const doctors = require('../database/models/doctors');
const treatments = require('../database/models/treatments');
const fs = require('fs');

const routers = express.Router();


// Delete the hospital and its info
routers.delete('/deleteHospital/:hospitalID', (req, res) => {
    // doctors.findOneAndDelete({HospitalId: req.params.hospitalID});
    hospitals.findByIdAndDelete(req.params.hospitalID)
    .then((hospitals)=>res.send(hospitals))
    .catch((error) => console.log(error));
});

// Delete the Doctor and his info
routers.delete('/deleteDoctor/:doctorID', (req, res) => {
    doctors.findByIdAndDelete(req.params.doctorID)
    .then((doctors)=>{
        const imageName = doctors.ImageSrc.split('http://localhost:3000/')[1];         
       fs.unlink('./'+imageName,(err) => {
        if (err) throw err;
        console.log(`${imageName} deleted`);});
        res.send(doctors);
    })
    .catch((error) => console.log(error));
});

// Delete the Treatment
routers.delete('/deleteTreatment/:treatmentID', (req, res) => {
    treatments.findByIdAndDelete(req.params.treatmentID)
    .then((treatments)=>res.send(treatments))
    .catch((error) => console.log(error));
});

module.exports = routers;