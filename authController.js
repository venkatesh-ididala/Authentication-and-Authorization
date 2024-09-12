const User=require('./../Models/userModel');
const asyncErrorHandler=require('./../Utils/asyncErrorHandler');
const jwt=require('jsonwebtoken');
const CustomError=require('./../Utils/CustomError');
const util=require('util');


const signToken=id=>{
    return jwt.sign({id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
    });
}

exports.signup=asyncErrorHandler(async(req,res,next)=>{
    const newUser=await User.create(req.body);
    
    const token=signToken(newUser._id);

    res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
    });


});

exports.login=asyncErrorHandler(async(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

        //check if the email and password are present req body

    if(!email || !password){
        const error=new CustomError('please provide email & password',400);

        //it will call the global error handler
        return next(error);
    }
    const user=await User.findOne({email}).select('+password');

   

    if(!user || !( await  user.comparePasswordInDB(password,user.password))){
         const err=new CustomError('Incorrect email or password',400);
         return next(err);
    }
    const token=signToken(user._id);


    res.status(200).json({
        status:'success',
        token,
        user
    })
})

exports.protect=asyncErrorHandler( async(req,res,next)=>{

        //read the token and check if it exist

        const testToken=req.headers.authorization;
        let token;

        if(testToken && testToken.startsWith('bearer')){
            token=testToken.split(' ')[1];
        }
        if(!token){
            next(new CustomError('you are not logged in'),401);
        }

        //validate the token
        const decodedToken=await util.promisify(jwt.verify)(token,process.env.SECRET_STR);

        console.log(decodedToken);

        //if the user exists or not
        const user=User.findById(decodedToken.id);
       
        if(!user){
                const  error=new CustomError("user with the given token doesn't  exist",401);
                next(error);
        }
        //console.log(decodedToken.iat);
        //if the user changed the password 
        //await user.isPasswordChanged(decodedToken.iat);
        const isChanged = await user.isPasswordChanged(decodedToken.iat);

if (isChanged) {
    const error = new CustomError("User has changed the password after the token was issued", 401);
    return next(error); // Ensure early return after error
}

        




        //console.log(token);






    next();
});


