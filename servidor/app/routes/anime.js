module.exports = function(application){ 
  
    application.get('/animes', function(req, res){		
      application.app.controllers.anime.getAnimes(application, req, res);		
    });

    application.get('/animes/:id', function(req, res){		
      application.app.controllers.anime.getAnime(application, req, res);		
    });

    application.get('/animes/detalhes/:id', function(req, res){		
      application.app.controllers.anime.getAnimeDetalhes(application, req, res);		
    });

    application.post('/animes', function(req, res){		
      application.app.controllers.anime.cadAnime(application, req, res);		
    });

    application.put('/animes', function(req, res){		
      application.app.controllers.anime.editAnime(application, req, res);		
    });

    application.delete('/animes/:idAnime', function(req, res){		
      application.app.controllers.anime.deleteAnime(application, req, res);		
    });

    application.post('/crawlerAnime', function(req, res){		
      application.app.controllers.anime.crawlerInfo(application, req, res);		
    });
    
    application.get('/crawlerAnime/AtualizarAnime', function(req, res){		

      const crawler = new application.app.models.crawler(application);
      
      crawler.jobAtualizarEpsSemanaisAnime();

      res.status(200).send("Sucesso");
      
    });
                
};