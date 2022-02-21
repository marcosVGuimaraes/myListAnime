//var application = require("../../config/server")

const Anime = require("./anime")

class EpisodioAnime {

    constructor(application) {
        this.application = application;
        this.connection = application.config.dbConnection;
        this.episodioAnimeDAO = new application.app.models.episodioAnimeDAO(application.config.dbConnection)
        this.animeDAO = new application.app.models.animeDAO(application.config.dbConnection)
    }

    atribuirIdANime(episodios, id_anime){
        
        episodios.forEach(element => {
                   
            element.push(id_anime);

        });
    
        return episodios;
    
    }

    async cadEpsAnime(eps_anime) {

        try {
    
            const episodioAnimeResult = await this.episodioAnimeDAO.CadEpsAnime(eps_anime);
    
            return episodioAnimeResult[0];
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
        }
    
    }

    async atualizarEpsAnimes(id_anime){        
    
        const retornoResult = await this.animeModel.verificarQntEpsAnime(id_anime);      
    
        if(retornoResult.qnt_epsLancados == retornoResult.qnt_eps ){
            
            return false;
        
        } else{
    
            var numero_ep = retornoResult.qnt_epsLancados + 1;
    
            for(var i = 0; i < eps.length; i++){
    
                numero_ep = numero_ep + i;
    
                eps[i].push(id_anime, numero_ep);
    
                console.log(eps[i]);
            }
        
        }
    
    }

    

}

module.exports = function(){
    return EpisodioAnime;
}