const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    
    const authHeader = req.headers.authorization;

    if(req.url === '/login' || req.url === '/usuario/cadastrar') return next();

    if(!authHeader){

        console.log("No token provided");

        return res.status(401).send({error: 'No token provided'});        
    }
        
    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({error: 'Token error'});

    const [ scheme, token] = parts;

    if(!/^Bearer$/i.test(scheme))
       return res.status(401).send({error: 'Token malformatted'});


    jwt.verify(token, 'teste-jwt', (err, decoded) => {
        
        console.log(err)

        if(err) return res.status(401).send({error: 'Token Invalido!'});
    
        req.userId = decoded.userId;

        return next();
    })

};