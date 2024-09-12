const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter your name']
    },
    email:{
        type:String,
        required:[true,"please enter email"],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"please enter a valid email"]
    },
    photo:String,
    password:{
        type:String,
        required:[true,'please enter a password'],
        minLength:8,
         select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'please confirm password'],
        validate:{

            //this validator function works on save and create only
            validator:function(val){
                return val ==this.password;
            },
            message:"password & confirm password have to be match"
        }
    },
    passwordChangedAt: Date,
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    
    this.password=await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;
    next();
});

userSchema.methods.comparePasswordInDB=async function(pswd,pswdDB){
   return await bcrypt.compare(pswd,pswdDB) ;
}

// userSchema.methods.isPasswordChanged =async function(JWTtime){

//     if(this.passwordChangedAt){
//         console.log(this.passwordChangedAt,JWTtime);
//     }
//     return false;
// }

userSchema.methods.isPasswordChanged = async function (JWTtime) {
    if (this.passwordChangedAt) {
        // Convert both times to milliseconds to perform the comparison
        const passwordChangedAtTime = this.passwordChangedAt.getTime() / 1000; // Convert to seconds
        return JWTtime < passwordChangedAtTime;
    }
    return false;
};


// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// }

const User=new mongoose.model('User',userSchema);

module.exports=User;

