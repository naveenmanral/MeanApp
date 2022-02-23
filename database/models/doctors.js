const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    Name:{
        type: String,
        trim : true, 
        requried: true
    },
    Department:{
        type : String,
        required : true
    },
    Description:{
        type : String,
        trim : true,
        required : true
    },
    HospitalId:{
        type : mongoose.Types.ObjectId,
        required : true
    },
    ImageSrc:{
        type : String,
        required : true
    }
})

DoctorSchema.index({Name:'text'});
module.exports = mongoose.model('Doctors',DoctorSchema);