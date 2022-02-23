const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const LoginDetailSchema = new mongoose.Schema({
    userName:{
        type: String,
        trim : true, 
        requried: true
    },
    password:{
        type : String,
        required : true
    },
    loggedInDateTime:{
        type : String,
        trim : true,
        required : true
    },
    loggedOutDateTime:{
        type : String,
        required : true
    },
    userRole:{
        type : String,
        required : true
    },
    registeredDate:{
        type : String,
        required : true
    }
});

LoginDetailSchema.pre('save', async function(next){
try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();

} catch (error) {
    next(error);
}
});


LoginDetailSchema.methods.isValidPassword =  async function (password) {
     try {
        return await bcrypt.compare(password,this.password);
     } catch (error) {
         throw error;
     } 
   
}



//loginDetailSchema.index({userName:'text'});
module.exports = mongoose.model('LoginDetails',LoginDetailSchema,'loginDetails');