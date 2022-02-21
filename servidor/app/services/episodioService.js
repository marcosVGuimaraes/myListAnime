module.exports.atualizarEpsAnimes = async function(application, eps, id_anime){

    var connection = application.config.dbConnection;

    var animeModel = new application.app.models.animeDAO(connection);

    const epsModel = new application.app.models.episodioAnimeDAO(connection);

    const retornoResult = await animeModel.verificarQntEpsAnime(id_anime);
  

    if(retornoResult.qnt_epsLancados == retornoResult.qnt_eps ){
        
        return false;
    
    } else{

        var numero_ep = retornoResult.qnt_epsLancados + 1;

        for(var i = 0; i < eps.length; i++){

            numero_ep = numero_ep + i;

            eps[i].push(id_anime, numero_ep);

            console.log(eps[i]);
        }
    
        /*const epsResult = await epsModel.CadEpsAnime(eps);

        if(epsResult){

            return true;

        }*/
    
    }

}