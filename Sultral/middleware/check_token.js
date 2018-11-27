const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const decode = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        if (decode.exp <= Date.now() / 1000) {
            return res.redirect('../../LogIn'); 
        }

        req.userData = decode;
        next();
    } catch (error) {
        console.log(error);
        return res.redirect('../../LogIn');
    }

};