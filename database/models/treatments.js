const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
    Name:{
        type: String,
        trim : true,
        requried: true
    },
    Department:{
        type : String,
        trim : true,
        required : true
    }
});

TreatmentSchema.index({Name:'text'});
module.exports = mongoose.model('Treatments',TreatmentSchema);