const midAuth = require("../../auth");

module.exports = function(application){   
   
    application.get('/lista', midAuth, function(req, res){		
      application.app.controllers.listaAnime.getLista(application, req, res);		
    });  
   
    application.post('/addItemLista', midAuth, function(req, res){		
      application.app.controllers.listaAnime.addItemLista(application, req, res);		
    });

    application.delete('/lista/:id', midAuth, function(req, res){		
      application.app.controllers.listaAnime.deleteItemLista(application, req, res);		
    });    

    application.get('/testeLista/:id', function(req, res){	
      
      var { id } = req.params;
      
      const itemLista = new application.app.models.itemLista(application);

      const retorno = itemLista.getItemLista(id);

      res.send(retorno)

    });  
      
};