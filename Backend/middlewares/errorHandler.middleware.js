

// const errorHandler = (err, req, res, next) => {

//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  
//   let message = err.message || "Internal Server Error";

//   res.status(statusCode).json({
//     success: false,
//     message
//   });

// };

// module.exports = errorHandler;


function errorHandler(err,req,res,next){

    const statusCode    = res.statusCode ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message,
        stack: err.stack
    });

}


module.exports = errorHandler