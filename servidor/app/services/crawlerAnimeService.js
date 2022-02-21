const cheerio = require('cheerio');

const axios = require("axios");

module.exports.crawlerGetAnime = async function(url){

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

module.exports.crawlerAtualizarGetAnime = async function(animeInfo){

    const body = await axios.get(animeInfo.link) 

    console.log(animeInfo)

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

