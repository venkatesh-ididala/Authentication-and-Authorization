//const {param}=require('../Routes/moviesRoutes');
const { query } = require('express');
const Movie=require('../Models/movieModel');
const Apifeatures=require('./../Utils/Apifeatures');
const CustomError = require('./../Utils/CustomError');
const asyncErrorHandler=require('./../Utils/asyncErrorHandler');


const fs=require('fs');

let movies=JSON.parse(fs.readFileSync("./data/movies.json"));

// exports.checkId=(req,res,next,value)=>{
//     console.log("movie id"+value);

//     let movie=movies.find(ele=>ele.id === value*1);   //returns undefined on not matching 

//     if(!movie){
//         return res.status(404).json({
//             status:"fail",
//             message:"The movie with the id  " +value+ " is not found"
//         })
//     }
//     next();
// }




// exports.validateBody=(req,res,next)=>{
//     if(!req.body.title || !req.body.budget){
//         return res.status(400).json({
//             status:"fail",
//             message:"Not  a valid movie data"
//         })

//     }
//     next();
// }

exports.getHighestRated=(req,res,next)=>{
    req.query.limit='5',
    req.query.sort='-ratings'

    next();
}

exports.getAllMovies=asyncErrorHandler(async (req,res)=>{
    // res.status(200).json({
    //     status:"success",
    //     count:movies.length,
    //     requestedAt:req.requestedAt,
    //     data:{
    //         movies:movies
    //     }
    // })
    
        const features=new Apifeatures(Movie.find(),req.query).filter().sort().limitFields().paginate();

        let movies=await features.query;


       
        //-----> Mongodb 6.0 or less this approach has to perform
       // console.log(req.query);

        // const excludeFields=['sort','page','limits','fields'];   //----> excluding the fields 

        // const queryObj={...req.query};
        // excludeFields.forEach(ele=>{
        //     delete queryObj[ele];
        // })
        // console.log(queryObj)
    //    // console.log(req.query);
    //     let queryStr=JSON.stringify(req.query);

    //     queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match) => `$${match}`);
    //     const queryObj= JSON.parse(queryStr);
    //     console.log(queryObj);


    //    let query=Movie.find(queryObj);
       //console.log(query);
       

    //    if(req.query.sort){
        
    
    //     //query=query.sort(req.query.sort);
    //        const sortBy=req.query.sort.split(',').join(' ');
    //        query=query.sort(sortBy);
    //     }
    //    else{
    //     query=query.sort('-createdAt');
    //    }


    //    if(req.query.fields){
    //        const fields= req.query.fields.split(',').join(' ');
    //        //console.log(fields);
    //        query=query.select(fields);
    //    }
    //    else{
    //      query=query.select('-__v');
    //    }

       //pagination
    //    const page=req.query.page*1 || 1;
    //    const limit=req.query.limit*1  || 10;
    //    // page 1:1-10 ,2:11-20
    //    const skip=(page-1)*limit;

    //    query=query.skip(skip).limit(limit);
    //    //console.log(skip);

    //    if(req.query.page){
    //     const Moviecount=await Movie.countDocuments();
       
    //    if(skip>=Moviecount){
    //     throw new Error("this page is not found");
    //    }
    // }
       

        //let movies=await  query;
       //console.log(movies);

       //const movies=await Movie.find().where('duration').equals(req.query.duration).where('ratings').equals(req.query.ratings)..where('ratings').gte(req.query.ratings);
        res.status(201).json({
            status:"success",
            count:movies.length,
            data:
            {
               movies
            }
    })

})

//Get -api with route parameters


exports.CreateMovie=asyncErrorHandler(async (req,res)=>{
    //  const newId=movies[movies.length-1].id+1;
    //  const newMovie=Object.assign({id:newId},req.body);

    //  movies.push(newMovie);

    //  fs.writeFile('./data/movies.json',JSON.stringify(movies),()=>{
    //     res.status(201).json({
    //         status:"success",
    //         data:{
    //             movies:newMovie
    //         }
    //     })
    //  })



    // const testMovie=new Movie();
    // testMovie.save().then(doc=>{
    //   console.log(doc)
    // }).catch(err=>{
    //     console.log("something error occured");
    // })
        
        const movie=await Movie.create(req.body)
    
        res.status(201).json({
            status:"success",
            data:{
                movie
            }
        })
})


exports.getMovie=asyncErrorHandler(async (req,res)=>{
    //console.log(req.params);
    // const id=req.params.id *1;
    // let movie=movies.find(ele=>ele.id === id);   //returns undefined on not matching 

    // // if(!movie){
    // //     return res.status(404).json({
    // //         status:"fail",
    // //         message:"The movie with the id  " +id+ " is not found"
    // //     })
    // // }
    



    // res.status(201).json({
    //     status:"success",
    //     data:{
    //         movie:movie
    //     }
    // })
    const movie= await Movie.findById(req.params.id);
   // const movie=Movie.findById(req.params.id)


   if(!movie){

    let error=new CustomError('cant find the movie with the id',404);
    return next(error);
   }

    res.status(201).json({
        status:"success",
        data:{
            movie
        }
    })

}
)
    
//Patch request to update the specific object property

exports.UpdateMovie=asyncErrorHandler(async(req,res)=>{
    // const id=req.params.id*1;
    // let movieToUpdate=movies.find(ele=> ele.id ===id);
    // let index=movies.indexOf(movieToUpdate);
    // let MovieUpdate=Object.assign(movieToUpdate,req.body);

    // movies[index]=movieToUpdate;

    // fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
    //     res.status(200).json({
    //         status:"success",
    //         data:{
    //             movie:movieToUpdate
    //         }
    //     })
    // })

        const Updatedmovie= await Movie.findByIdAndUpdate(req.params.id,req.body,{new :true,runValidators:true})
       // const movie=Movie.findById(req.params.id)

       if(!Updatedmovie){

        const error=new CustomError('cant find the movie with the id',404);
        return next(error);
       }
    
        res.status(201).json({
            status:"success",
            data:{
                movie:Updatedmovie
            }
        })


})


//delete method request

exports.deleteMovie=asyncErrorHandler(async(req,res)=>{
    // const id=req.params.id*1;
    // let movieToDelete=movies.find(ele=>ele.id===id);
    // let index=movies.indexOf(movieToDelete);

    // // if(!movieToDelete){
    // //     res.status(404).json({
    // //         status:"fail",
    // //         message:"No movie with the id "+id+" to delete"
    // //     })
    // // }

    // movies.splice(index,1);

    // fs.writeFile('./data/movies.json',JSON.stringify(movies),(err)=>{
    //     res.status(204).json({
    //         status:"success",
    //         data:{
    //             movie:null
    //         }
    //     })
    // })


    
         await Movie.findByIdAndDelete(req.params.id)
       // const movie=Movie.findById(req.params.id)
    
        res.status(201).json({
            status:"success",
            data:null
        })
    
})

exports.getMovieStats=asyncErrorHandler(async (req,res)=>{

        const stats=await Movie.aggregate([
           // {$match:{'releaseYear':{$lte:2023}}},  //---> date.now() --represents in milli seconds but new date() represents the date in date and time
            //{$match:{ratings:{$gte:4.5}}},
            {$group:{
                _id:'$releaseYear',
                avgRating:{$avg:'$ratings'},
                avgPrice:{$avg:'$price'},
                minPrice:{$min:'$price'},
                maxRating:{$max:'$ratings'},
                totalPrice:{$sum:'$price'},
                movieCount:{$sum:1}

            }},
            // {$sort:{
            //     minPrice:1
            // }}
           // {$match:{
               // maxRating:{$gte:7}
           // }}
        ]);

        res.status(201).json({
            status:"success",
            data:{
                stats
            }
        })

   
})

exports.getMovieByGenre=asyncErrorHandler(async(req,res)=>{
    

        const genre=req.params.genre;
       // console.log(genre);
        const movies=await Movie.aggregate([
            {$unwind:'$genres'},
            {$group:{
                _id:'$genres',
                movieCount:{$sum:1},
                movies:{$push:'$name'}

            }},
            {$addFields:{genre:'$_id'}},
            {$project:{_id:0}},
            {$sort:{movieCount:-1}},
           // {$limit:6},
            {$match:{genre:genre}}
        ]);

        

        res.status(201).json({
            status:"success",
            count:movies.length,
            data:{
                movies
            }
        })

})