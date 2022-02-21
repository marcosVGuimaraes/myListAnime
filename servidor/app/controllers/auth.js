const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

function generateToken(parametros) {

    return jwt.sign( {userId: parametros}, "teste-jwt", { expiresIn: "1h" });

}

module.exports.login = async function (application, req, res) {

    try {

        var db = application.config.dbConnection;        

        const usuario = req.body;

        const result = await getUsuario(usuario.email, db);

        console.log(result);

        if (result.length == 0 ){

            res.status(401).json({ error: "Usuario não encontrado!" });

        }else if (result[0].email == usuario.email && (await bcrypt.compare(usuario.senha, result[0].senha))) {

            const token = await generateToken(result[0].id_usuario);

            console.log("Token gerado: " + token);

            res.json({ auth: true, token: token });

        } else {
            
            res.status(401).json({ error: "Usuario ou senha invalidos" });
        
        }     
  
    } catch (e) {

        console.log(e);
    
        res.status(500).send({ error: e });
    
    }    

}

module.exports.cadastrarUsuario = async function (application, req, res) {

    try {

        var db = application.config.dbConnection;

        const usuario = {
          nome_usuario: req.body.nome_usuario,
  
          email: req.body.email,
  
          senha: await bcrypt.hash(req.body.senha, 12),
        };
  
        const result = await db.query("insert into usuarios set ? ", usuario);
  
        const token = generateToken({ userId: result[0].insertId });

        const result2 = await db.query("insert into lista (id_usuario) value ("+ result[0].insertId +")");
        
        res.json({
  
          msg: "O usuario foi inserido com sucesso com o id: " + result[0].insertId,
  
          token: token,
    
        });
    
    } catch (e) {
        console.log(e);

        res.status(500).json({ error: e });

    }

}
  
async function getUsuario(email, db) {
  
    const result = await db.query("SELECT id_usuario, email, senha FROM usuarios where email = '" + email + "'");
     
    return result[0];
  
}
  
