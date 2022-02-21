module.exports.veficacaoItemListaJaCadastrado = async function(application, id_anime){

    var connection = application.config.dbConnection;

    var itemListaModel = new application.app.models.itemListaDAO(connection);

    const itemListaResult = await itemListaModel.FindByIdAnime(id_anime);

    console.log(itemListaResult)
    
    if(itemListaResult.length == 0){
        
        return false;
    
    } else{
    
        return true;
    
    }

}

module.exports.atualizarStatusItemLista = async function(application, id_itemLista){

    try{

        var connection = application.config.dbConnection;

        var itemListaModel = new application.app.models.itemListaDAO(connection);

        var itemLista = await itemListaModel.FindStatusItemLista(id_itemLista);

        console.log(itemLista[0].qnt_eps == itemLista[0].eps_assistidos)

        console.log(itemLista[0].qnt_eps > itemLista[0].eps_assistidos)
        
        if(itemLista[0].qnt_eps == itemLista[0].eps_assistidos){

            itemLista[0].status = 'Finalizado';
            
            const result = await itemListaModel.atualizarStatusItemLista(itemLista[0].status, id_itemLista);

            console.log("Atualizado para finalizado: ")
        
        } else if(itemLista[0].qnt_eps > itemLista[0].eps_assistidos && itemLista[0].status == 'Finalizado'){
            
            itemLista[0].status_anime = 'Em exibição';
            
            const result = await itemListaModel.atualizarStatusItemLista(itemLista[0].status, id_itemLista);

            console.log("Atualizado para em exibição: ")
            
        }else{

            console.log("Não foi atualizado!")
            
        }    

       
    } catch(e){

        console.log(e);

    }
}