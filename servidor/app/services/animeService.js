var dateFormat  = require('dateformat');

module.exports.veficacaoAnimeJaCadastrado = async function(application, anime){

    var connection = application.config.dbConnection;

    var animeModel = new application.app.models.animeDAO(connection);

    const animesResult = await animeModel.verificarExisteAnime(anime);
    
    if(animesResult[0].length == 0){
        
        return false;
    
    } else{
    
        return true;
    
    }

}

module.exports.atualizarStatusAnime = async function(application,id_anime){

    try{

        var connection = application.config.dbConnection;

        var animeModel = new application.app.models.animeDAO(connection);

        var anime = await animeModel.FindStatusAnime(id_anime);

        //console.log(anime[0]);

        //console.log(anime[0])
        
        console.log(anime[0][0].eps_lancados, anime[0][0].qnt_eps, anime[0][0].status_anime)

        console.log(parseInt(anime[0][0].eps_lancados) < parseInt(anime[0][0].qnt_eps) && anime[0][0].status_anime == 'Finalizado')

        if(parseInt(anime[0][0].eps_lancados) == parseInt(anime[0][0].qnt_eps) && anime[0][0].status_anime != 'Finalizado' ){

            anime[0].status_anime = 'Finalizado';
            
            const result = await animeModel.atualizarStatusAnime(anime[0].status_anime, id_anime);

            console.log("Alterado para Finalizado!")

            console.log(result)
        
        } else if(parseInt(anime[0][0].eps_lancados) < parseInt(anime[0][0].qnt_eps) && anime[0][0].status_anime == 'Finalizado' ){
            
            anime[0][0].status_anime = 'Em exibição';
            
            const result = await animeModel.atualizarStatusAnime(anime[0][0].status_anime, id_anime);

            console.log("Alterado para Em exibição!")

            console.log(result)
                
        }    

        return true;

    } catch(e){

        console.log(e);

    }
}

module.exports.jobAtualizarEpsSemanaisAnime = async function(){

    try{

        const application = require('../../config/server');

        const animesParaAtualizar = await buscarAnimesComNovosEpLancados(application);

        console.log("Animes que tem episodios novos episodios encontrados...");
        
        var connection = application.config.dbConnection;

        var episodioModel = new application.app.models.episodioAnimeDAO(connection);

        console.log(animesParaAtualizar);

        if(animesParaAtualizar.length > 0){

            console.log(animesParaAtualizar.length + ' animes serão atualizados!')

            await animesParaAtualizar.forEach(async element => { 

                var log = {
                    id_animes_alterados: element.id_anime,
                    animes_novos: 0,
                    mensagem_log: ''
                }

                let cont = 1;
                
                const animeInfo = {
                    link: element.link,
                    dataUltimoEp: (element.dataUltimoEp != null ? element.dataUltimoEp.getTime() : element.dt_lancamento.getTime()),
                    dt_lancamento: element.dt_lancamento.getTime(),            
                }
    
                let novosEpisodios = await application.app.services.crawlerAnimeService.crawlerAtualizarGetAnime(animeInfo)
    
                let novosEpsAnimes = [];
    
                await novosEpisodios.forEach(async episodio => {
                    
                    episodio.id_anime = element.id_anime;
    
                    episodio.numero_ep = element.eps_lancados + cont
    
                    episodio.data_lancamento = dateFormat(episodio.data_lancamento,"yyyy-mm-dd");
                    
                    novosEpsAnimes.push([episodio.numero_ep, episodio.nome_ep, episodio.data_lancamento, element.id_anime]);
    
                    cont = cont + 1;
                
                });    
    
                console.log(novosEpsAnimes)
                
                if(novosEpsAnimes.length > 0){
    
                    const result = await episodioModel.CadEpsAnime(novosEpsAnimes);

                    log.mensagem_log = result[0].affectedRows + " novos episodios foram cadastrados";

                    log.animes_novos = 1;
    
                    let resultAtualizarStatus = await application.app.services.animeService.atualizarStatusAnime(application, element.id_anime)
            
                }else {

                    log.mensagem_log = "Não houve episodios para ser cadastrados!";                    

                }

                console.log(log);
                
                const logReturn = await episodioModel.salvarLogAtualizacaoCrawler(log);

                console.log(logReturn)
            });

        } else{

            const logReturn = await episodioModel.salvarLogAtualizacaoCrawler({
                id_animes_alterados: 0,
                animes_novos: 0,
                mensagem_log: 'Sem animes para atualizar no momento!'
            });

            console.log('Sem animes para atualizar no momento!')
        }

        return true

    } catch(e){

        console.log(e);

    }
}

async function buscarAnimesComNovosEpLancados(application) {  
    

    var connection = application.config.dbConnection;

    var animeModel = new application.app.models.animeDAO(connection);

    var date = new Date();

    date.setDate(date.getDate() -7)
    
    const filtroData = date.getFullYear() +"-"+ (date.getMonth() + 1) +"-"+ date.getDate()

    var result = await animeModel.FindAnimesParaCrawler(filtroData);

    return result;
}

