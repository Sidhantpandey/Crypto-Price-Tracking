const asyncHandler = (requestHandler) => {
    // return (error,req,res,next)
    return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
  };
  export { asyncHandler };
  