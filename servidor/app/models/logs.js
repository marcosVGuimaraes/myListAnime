var dateFormat = require('dateformat');

class Logs {

    constructor(application) {

        this.application = application;
        this.connection = application.config.dbConnection;
        this.logCrawlerEpsAnimesDAO = new application.app.models.logCrawlerEpsAnimesDAO(application.config.dbConnection)
        
    }

    async getLogsCrawlerAtualizaEps(primeiro_registro) {

        try {
   
            const logCrawlerEpsAnimesDAOResult = await this.logCrawlerEpsAnimesDAO.FindLogsCrawlerAtualizaEps(primeiro_registro);
    
            logCrawlerEpsAnimesDAOResult[0].forEach(element => { 
               
                element.dt_cadastro = dateFormat(element.dt_cadastro,"dd/mm/yyyy - HH:mm");
            });
    
            return logCrawlerEpsAnimesDAOResult[0];
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
        }
    }

   

}

module.exports = function(){
    return Logs;
}


