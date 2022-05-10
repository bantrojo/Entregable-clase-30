exports.adminAuth = (req, res, next) => {
    const isAdmin = req.headers.authorization || 'false'
    if (isAdmin == 'false') {
        return res.json({ status: false, message: 'call the admin' })
    }
next();
}