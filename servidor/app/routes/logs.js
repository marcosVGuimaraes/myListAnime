module.exports = function (application) {

    application.post("/logs/crawlerAtualizaEps", async function (req, res) {
      application.app.controllers.logs.getLogsCrawlerAtualizaEps(application, req, res);
    });    
  
  };
  
  