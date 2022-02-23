const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    Name:{
        type: String,
        trim : true,
        requried: true
    },
    Description:{
        type : String,
        trim : true,
        required : true
    },
    Place:{
        type : String,
        trim : true,
        required : true
    },
    ImageSrc:{
        type : String,
        trim : true,
        required : true
    }
});

HospitalSchema.index({Name:'text'});
module.exports = mongoose.model('Hospitals',HospitalSchema);