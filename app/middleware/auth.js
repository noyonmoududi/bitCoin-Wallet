module.exports = (req, response, next) => {
    if (!req.session.user) {
        if (isApiCall(req)) {
            delete Request.session.user;
            return response.send({
                'error': 1,
                'error_code': 'AUTH_FAILED',
                'message': 'Authentication required'
            });
        }
        return response.redirect('/login');

    } else {
        next();
    }
};