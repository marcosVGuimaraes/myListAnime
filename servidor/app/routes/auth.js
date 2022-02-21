module.exports = function (application) {

  application.post("/login", async function (req, res) {
    application.app.controllers.auth.login(application, req, res);
  });

  application.post("/usuario/cadastrar", async function (req, res) {
    application.app.controllers.auth.cadastrarUsuario(application, req, res);
  });

};

