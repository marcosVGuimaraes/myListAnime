const midAuth = require("../../auth");

module.exports = function(application){ 
  
    application.get('/epsAnime/:idAnime', midAuth, function(req, res){		
      application.app.controllers.epsiodioAnime.getEpsAnime(application, req, res);		
    });    
    
    application.get('/getEpsAssistidos/:idItemLista', midAuth, function(req, res){		
      application.app.controllers.epsiodioAnime.getEpsAssistidos(application, req, res);		
    }); 
    
    application.get('/getEpsNaoAssistidos/:idItemLista/:idAnime', midAuth, function(req, res){		
      application.app.controllers.epsiodioAnime.getEpsNaoAssistidos(application, req, res);		
    });
    
    application.post('/assistirEps', midAuth, function(req, res){		
      application.app.controllers.epsiodioAnime.assistirEps(application, req, res);		
    });

    application.post('/epsAnime', midAuth, function(req, res){		
      application.app.controllers.epsiodioAnime.cadEpsAnime(application, req, res);		
    });

    application.delete('/epsAnime/:id', midAuth, function(req, res){		
      application.app.controllers.epsiodioAnime.deleteEpisodio(application, req, res);		
    });
};