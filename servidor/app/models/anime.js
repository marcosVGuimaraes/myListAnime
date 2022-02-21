var dateFormat = require('dateformat');

class Anime {

    constructor(application) {

        this.application = application;
        this.connection = application.config.dbConnection;
        this.animeDAO = new application.app.models.animeDAO(application.config.dbConnection)
        
    }

    async getAnimes() {

        try {
   
            var animeModel = new this.application.app.models.animeDAO(this.connection);

            const animesResult = await this.animeDAO.FindAll();
    
            animesResult[0].forEach(element => { 
               
                element.dt_lancamento = dateFormat(element.dt_lancamento,"dd/mm/yyyy");
            });
    
            return animesResult[0];
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
        }
    }

    async getAnime(id_anime) {

        try {
        
            const animesResult = await this.animeDAO.FindAnime(id_anime);
    
            return animesResult[0];
    
        } catch (e) {
    
            console.log(e);
    
            res.status(500).send(e);
        }
    
    }

    async cadAnime (anime, episodios) {

        try {
    
            const animesResult = await this.animeDAO.CadAnime(anime);
    
            return animesResult[0].insertId;
        
        } catch (e) {
    
            console.log(e);
    
           return new UserException(e);
        }
    
    }

    async veficacaoAnimeJaCadastrado(anime) {
    
        try {

            const verificacaoAnime = await this.animeDAO.verificarExisteAnime(anime);
            
            if(verificacaoAnime[0].length == 0){
            
                return false;
            
            } else{
            
                return true;    
            
            }
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
        }
    }

    async atualizarStatusAnime(id_anime){

        try{
            
            var anime = await this.animeDAO.FindStatusAnime(id_anime);
            
            // console.log(anime[0][0].eps_lancados, anime[0][0].qnt_eps, anime[0][0].status_anime)
    
            // console.log(parseInt(anime[0][0].eps_lancados) < parseInt(anime[0][0].qnt_eps) && anime[0][0].status_anime == 'Finalizado')
    
            if(parseInt(anime[0][0].eps_lancados) == parseInt(anime[0][0].qnt_eps) && anime[0][0].status_anime != 'Finalizado' ){
    
                anime[0].status_anime = 'Finalizado';
                
                const result = await this.animeDAO.atualizarStatusAnime(anime[0].status_anime, id_anime);
    
                console.log("Alterado para Finalizado!")
            
            } else if(parseInt(anime[0][0].eps_lancados) < parseInt(anime[0][0].qnt_eps) && anime[0][0].status_anime == 'Finalizado' ){
                
                anime[0][0].status_anime = 'Em exibição';
                
                const result = await this.animeDAO.atualizarStatusAnime(anime[0][0].status_anime, id_anime);
    
                console.log("Alterado para Em exibição!")
                    
            }    
    
            return true;
    
        } catch(e){
    
            console.log(e);

            return new UserException(e);
    
        }
    }
    
    async buscarAnimesComNovosEpLancados() {      
    
        var date = new Date();
    
        date.setDate(date.getDate() -7)
        
        const filtroData = date.getFullYear() +"-"+ (date.getMonth() + 1) +"-"+ date.getDate()
    
        var result = await this.animeDAO.FindAnimesParaCrawler(filtroData);
    
        return result;
    }

    async salvarLogAtualizacaoCrawler(log){

        const result = await this.animeDAO.salvarLogAtualizacaoCrawler(log)

        return result;

    }

}

module.exports = function(){
    return Anime;
}


