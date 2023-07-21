exports.ensureAuthenticated = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

exports.ensureRole = function(role) {
    return function(req, res, next) {
        if (req.session.user && req.session.user.role === role) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden' });
        }
    }
}
