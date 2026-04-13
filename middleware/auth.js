// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
};

const requireAnyRole = (allowedRoles = []) => {
    return (req, res, next) => {
        const role = req.session && req.session.role;

        if (!role) {
            return res.status(403).json({ error: 'User role not found in session' });
        }

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ error: 'Access denied for your role' });
        }

        next();
    };
};

module.exports = { requireAuth, requireAnyRole };
