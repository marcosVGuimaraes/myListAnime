const jwt = require("jsonwebtoken");

module.exports.generateToken = function (parametros) {

    return jwt.sign( {userId: parametros}, "teste-jwt", { expiresIn: 300 });

}