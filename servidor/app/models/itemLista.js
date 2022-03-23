const Anime = require("./anime")

var dateFormat = require('dateformat');

class ItemLista {

    constructor(application) {
        this.application = application;
        this.connection = application.config.dbConnection;
        this.itemListaDAO = new application.app.models.itemListaDAO(this.connection);
        this.episodioAnimeDAO = new application.app.models.episodioAnimeDAO(application.config.dbConnection)
        this.animeDAO = new application.app.models.animeDAO(application.config.dbConnection)
    }

    async getLista (userId) {

        try {
    
            const listaAnimesResult = await this.itemListaDAO.FindAssistindo(userId);
    
            listaAnimesResult[0].forEach(element => {
               
                element.ultimaVez_assistido = dateFormat(element.ultimaVez_assistido, "dd/mm/yyyy");
    
                element.adicionado_em = dateFormat(element.adicionado_em, "dd/mm/yyyy");
    
            });

            return listaAnimesResult[0];
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
    
        }
    }

    async getItemLista (id_itemLista) {

        try {

            console.log(id_itemLista)
    
            const itemListaResult = await this.itemListaDAO.FindById(id_itemLista);
    
            itemListaResult[0].forEach(element => {
               
                element.ultimaVez_assistido = dateFormat(element.ultimaVez_assistido, "dd/mm/yyyy");
    
                element.adicionado_em = dateFormat(element.adicionado_em, "dd/mm/yyyy");
    
            });

            console.log(itemListaResult[0])

            return itemListaResult[0];
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
    
        }
    }

    async addItemLista (idAnime, userId) {

        try {
            
            const verificacaoItemLista = await this.application.app.services.itemListaService.veficacaoItemListaJaCadastrado(this.application, idAnime);
    
            if (verificacaoItemLista == true) {
                
                return {statusCod: 400, msg:"Esse anime ja foi adicionado a sua lista!"};

            } else{

                const id_lista = await this.itemListaDAO.FindListaByUser(userId);

                console.log(id_lista[0].id_lista)
    
                var itemLista = {
                    id_anime: idAnime,
                    id_lista: id_lista[0].id_lista,
                    status: "Assistindo"
                };
    
                const listaAnimesResult = await this.itemListaDAO.addItemLista(itemLista);
    
                return {statusCod: 200, msg:"O anime foi adicionado a sua lista!"};
    
            }
            
        } catch (e) {

            console.log(e);
    
            return new UserException(e);

        }
    }
    
    async deleteItemLista (id_itemLista) {
    
        try {
               
            const listaAnimesResult = await this.itemListaDAO.deleteItemLista(id_itemLista);
    
            if (listaAnimesResult) {
    
                console.log(listaAnimesResult);
    
                return {statusCod: 204, msg:"O item foi removido da lista!"};
    
            }
    
        } catch (e) {
    
            console.log(e);
    
            return new UserException(e);
        }
    
    }

    async atualizarStatusItemLista(id_itemLista){

        try{
               
            var itemLista = await this.itemListaDAO.FindStatusItemLista(id_itemLista);
    
            //console.log(itemLista[0].qnt_eps == itemLista[0].eps_assistidos)
    
            //console.log(itemLista[0].qnt_eps > itemLista[0].eps_assistidos)
            
            if(itemLista[0].qnt_eps == itemLista[0].eps_assistidos){
    
                itemLista[0].status = 'Finalizado';
                
                const result = await this.itemListaDAO.atualizarStatusItemLista(itemLista[0].status, id_itemLista);
    
                console.log("Atualizado para finalizado: ")
            
            } else if(itemLista[0].qnt_eps > itemLista[0].eps_assistidos && itemLista[0].status == 'Finalizado'){
                
                itemLista[0].status_anime = 'Em exibição';
                
                const result = await this.itemListaDAO.atualizarStatusItemLista(itemLista[0].status, id_itemLista);
    
                console.log("Atualizado para em exibição: ")
                
            }else{
    
                console.log("Não foi atualizado!")
                
            }    
    
           
        } catch(e){
    
            console.log(e);

            return new UserException(e);
    
        }
    }   

}

module.exports = function(){
    return ItemLista;
}

