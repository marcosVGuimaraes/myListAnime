var dateFormat = require('dateformat');

const cheerio = require('cheerio');

const axios = require("axios");

class Crawler {

    constructor(application) {

        this.application = application;
        this.connection = application.config.dbConnection;
        this.animeModel = new application.app.models.anime(application);
        this.episodioModel = new application.app.models.episodioAnime(application);
        
    }

    async crawlerGetAnime(url){

        try{
           
            const body = await axios.get(url) 
    
            //Extraindo os dados da pagina        
            var $ = cheerio.load(body.data);
    
            var titulo = $(".data h1").text().trim();
    
            var nota = $(".dt_rating_vgs").text().trim();
    
            var sinopse = $(".resumotemp .wp-content p").text().trim();
    
            var genero = ''
    
            $(".sgeneros").each(function () {
    
              $(this).find("a").each(function () {
               
                genero += $(this).text() + ", "
              
              });
    
            });
    
            var episodios = [];
    
            //Extraindo a temporada do anime
            $(".se-c").each(function () {
    
                //Objeto Temporada
                var temp = {
                    temporada: $(this).find(".title").text().trim(),
                    episodio: []
                }
    
                //Extraindo as informações dos episodios dos animes
                $(this).find('.se-a .episodios li').each(function () {
                    
                    var nome_ep = $(this).find(".episodiotitle a").text().trim();
                    
                    var data_lançamento_string = $(this).find(".date").text().trim();
    
                    var data_lançamento = new Date(data_lançamento_string);
    
                    temp.episodio.push({ nome_ep: nome_ep, data_lançamento: data_lançamento });
                });
    
                episodios.push(temp);
            });
    
            //Objeto anime
            var anime = {
                titulo: titulo,
                nota: nota,
                sinopse: sinopse,
                genero: genero,
                episodios: episodios
            };
    
            return anime;
    
            //return true;
    
        } catch(e){
    
            console.log(e);
    
            //res.status(400).send(e);
    
        }
    }
    
    async crawlerAtualizarGetAnime(animeInfo){
    
        const body = await axios.get(animeInfo.link) 
    
        // console.log(animeInfo)
    
        //Extraindo os dados da pagina        
        var $ = cheerio.load(body.data); 
        
        var temp_episodio = [];
    
        //Extraindo a temporada do anime
        $(".se-c").each(function () {
            
            //Extraindo as informações dos episodios dos animes
            $(this).find('.se-a .episodios li').each(function () {
    
                var nome_ep = $(this).find(".episodiotitle a").text().trim();
    
                var data_lançamento_string = $(this).find(".date").text().trim();
    
                var data_lancamento = new Date(data_lançamento_string);
    
                // console.log(data_lancamento.getTime() > animeInfo.dataUltimoEp.getTime() && data_lancamento.getTime() > animeInfo.dt_lancamento.getTime());
    
                if (data_lancamento.getTime() > animeInfo.dataUltimoEp && data_lancamento.getTime() > animeInfo.dt_lancamento) {
    
                    temp_episodio.push({ nome_ep: nome_ep, data_lancamento: data_lancamento.getTime() });
    
                }
                
            });
    
        });
    
        return temp_episodio;
    
    }

    async jobAtualizarEpsSemanaisAnime(){

        try{
    
            const animesParaAtualizar = await this.animeModel.buscarAnimesComNovosEpLancados();
    
            console.log("Animes que tem episodios novos episodios encontrados...");
            
            //var connection = application.config.dbConnection;
    
            //var episodioModel = new application.app.models.episodioAnimeDAO(connection);
    
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
        
                    let novosEpisodios = await this.crawlerAtualizarGetAnime(animeInfo)
        
                    let novosEpsAnimes = [];
        
                    await novosEpisodios.forEach(async episodio => {
                        
                        episodio.id_anime = element.id_anime;
        
                        episodio.numero_ep = element.eps_lancados + cont
        
                        episodio.data_lancamento = dateFormat(episodio.data_lancamento,"yyyy-mm-dd");
                        
                        novosEpsAnimes.push([episodio.numero_ep, episodio.nome_ep, episodio.data_lancamento, element.id_anime]);
        
                        cont = cont + 1;
                    
                    });    
        
                    // console.log(novosEpsAnimes)
                    
                    if(novosEpsAnimes.length > 0){
        
                        const result = await this.episodioModel.cadEpsAnime(novosEpsAnimes);

                        console.log(result)
    
                        log.mensagem_log = result.affectedRows + " novos episodios foram cadastrados";
    
                        log.animes_novos = 1;
        
                        let resultAtualizarStatus = await this.animeModel.atualizarStatusAnime(element.id_anime)
                
                    }else {
    
                        log.mensagem_log = "Não houve episodios para ser cadastrados!";                    
    
                    }
    
                    console.log(log);
                    
                    const logReturn = await this.animeModel.salvarLogAtualizacaoCrawler(log);
    
                    console.log(logReturn)
                });
    
            } else{
    
                const logReturn = await this.animeModel.salvarLogAtualizacaoCrawler({
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

}

module.exports = function(){
    return Crawler;
}