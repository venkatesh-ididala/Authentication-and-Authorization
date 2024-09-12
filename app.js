// Import package

const express=require('express');
const morgan=require('morgan');
const CustomError=require('./Utils/CustomError.js');
const globalErrorHandler=require('./Controllers/errorController.js');


const authRouter=require('./Routes/authRouter.js');
const moviesRouter=require('./Routes/moviesRoutes.js');

let app=express();  //----creating a object to access bunch of methods
app.use(express.json());   //---->it is not actually middlware function it is calling  a middleware function

// const logger=function(req,res,next){
//     console.log("custom middleware created");
//     next();
// }
app.use('/api/v1/users',authRouter);

 //--->returns a funtion logger
 app.use(express.static('./public'));


// if(process.env.NODE_ENV ==='development'){
//     app.use(morgan('dev')) 
// }
// app.use(logger);
// API JSON DATA SENDING AS A RESPONSE
// app.use((req,res,next)=>{
//     req.requestedAt=new Date().toISOString();
//     next();
// })
// Route=http method + url

// app.get('/',(req,res)=>{
//    // res.status(200).send("hello !this is express");
//    res.json({message:"this is venky",status:200});

// })

// Custom Middleware 









//Route Handling 

// app.get('/api/v1/movies',getAllMovies);
// app.get('/api/v1/movies/:id',getMovie);
// app.patch('/api/v1/movies:id',UpdateMovie);
// app.post('/api/v1/movies',CreateMovie);
// app.delete('/api/v1/movies/:id',deleteMovie);


//Routing 









app.use('/api/v1/movies',moviesRouter);

//create a router for user authentication


//default route for all not defined routes
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:"fail",
    //     message:`can't find ${req.originalUrl} on the server`
    // });
    
    // const err=new Error(`Can't  find ${req.originalUrl} on the server`);
    // err.status="fail";
    // err.statusCode=404;


    //custom error -->
    const err=new CustomError(`Can't  find ${req.originalUrl} on the server`,404);

    next(err);

    

});

//global error handling middleware

app.use(globalErrorHandler);


module.exports=app;