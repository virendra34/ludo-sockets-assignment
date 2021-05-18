/**
 * catch Errors handler
 */
 exports.catchErrors = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            // Validation errors
            if (typeof err === 'string') {
                res.status(400).json({
                    message: err
                });
            } else {
                next(err);
            }
        })
    }
}
/**
 * DB errors handler
 */
exports.mongooseErrors = (err, req, res, next) => {
    if (!err.erros) return next(err);
    const errorKeys = Object.keys(err.erros);
    let message = "";
    errorKeys.forEach((key) => (message += err.erros[key].message + ""));
    message = message.substr(0, message.length - 2);
    res.status(400), json({
        messsage,
    });
}
/**
 * Develpoment errors handler
 * 
 */
exports.developmentErrors = (err, req, res, next) => {
    err.stack = err.stack || '';
    const errorDetails = {
        message: err.message,
        stack: err.stack,
        status: err.status,
    };
}
/**
 * Production error handler
 * No stack trace and errors are leaked to user
 */
exports.productionErrors = (err, req, res, next) => {
    res.status(err.status || 500).json({
        error: 'Internal server error',
    });
}

/**
 * 404 page error
 */
exports.notFound = (req, res, next) => {
    res.status(404).json({
        message: 'Route not found',
    });
}