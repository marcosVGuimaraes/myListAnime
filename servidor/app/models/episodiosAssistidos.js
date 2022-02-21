const Anime = require("./anime")

class EpisodiosAssistidos {

    constructor(application) {
        this.application = application;
        this.connection = application.config.dbConnection;
        this.episodioAnimeDAO = new application.app.models.episodioAnimeDAO(application.config.dbConnection);
        this.animeDAO = new application.app.models.animeDAO(application.config.dbConnection);
        this.episodioAssitidosDAO = new application.app.models.episodioAssitidosDAO(application.config.dbConnection);
    }

    async assistirEps (ep_anime) {

        try {
                    
            const episodioAnimeResult = await this.episodioAssitidosDAO.assistirEps(ep_anime);
    
            if(episodioAnimeResult[0].insertId){
                 
                const itemLista = new this.application.app.models.itemLista(this.application);
    
                itemLista.atualizarStatusItemLista(ep_anime.id_itemLista);
            }
    
            return {statusCod: 200, msg:"O episodio foi assistido!"};
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
        }
    }    

    async deletarEpAssistido (id_ep_assistido) {

        try {
                    
            const episodioAnimeResult = await this.episodioAssitidosDAO.deleteEpAssistido(id_ep_assistido);
    
            if(episodioAnimeResult[0].affectedRows > 0){
                 
                const itemLista = new this.application.app.models.itemLista(this.application);
    
                itemLista.atualizarStatusItemLista(id_ep_assistido);
            }
    
            return {statusCod: 204, msg:"O episodio assistido foi deletado!"};
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
        }
    }

}

module.exports = function(){
    return EpisodiosAssistidos;
}



