//async utility
//wrapper to return a more "powered" function

module.exports.catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    };
}