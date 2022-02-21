var dateFormat  = require('dateformat');

module.exports.getAnimes = async function (application, req, res) {

    try {

        var animeModel = new application.app.models.anime(application);

        const animesResult = await animeModel.getAnimes();

        res.status(200).send(animesResult);

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}

module.exports.getAnime = async function (application, req, res) {

    try {

        var { id } = req.params;

        var connection = application.config.dbConnection;

        var animeModel = new application.app.models.animeDAO(connection);

        const animesResult = await animeModel.FindAnime(id);

        console.log(animesResult);

        res.status(200).send(animesResult);

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}

module.exports.getAnimeDetalhes = async function (application, req, res) {

    try {

        var { id } = req.params;

        var connection = application.config.dbConnection;

        var animeModel = new application.app.models.animeDAO(connection);

        var episodioModel = new application.app.models.episodioAnimeDAO(connection);

        const animesResult = await animeModel.FindAnime(id);

        animesResult[0].forEach(element => {

            element.dt_lancamento = dateFormat(element.dt_lancamento,"dd/mm/yyyy");

        });

        const episodioResult =  await episodioModel.FindByIdAnime(id)

        episodioResult[0].forEach(element => {

            element.dt_lancamento = dateFormat(element.dt_lancamento,"dd/mm/yyyy");

        });


        res.status(200).send({anime: animesResult[0], episodios: episodioResult[0]});

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}

module.exports.cadAnime = async function (application, req, res) {

    try {

        var anime = req.body.anime;

        var episodios = req.body.episodios;

        var animeModel = new application.app.models.anime(application);

        var episodioAnimeModel = new application.app.models.episodioAnime(application);
       
        const animesResult = await animeModel.cadAnime(anime, episodios);

        if (animesResult) {

            const episodiosTradados = await episodioAnimeModel.atribuirIdANime(episodios, animesResult);

            console.log(episodiosTradados)

            const episodioResult = await episodioAnimeModel.cadEpsAnime(episodiosTradados);

            res.status(200).send("Anime cadastrado!");

        }

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}

module.exports.editAnime = async function (application, req, res) {

    try {

        var anime = req.body.anime;

        console.log(anime)

        var connection = application.config.dbConnection;

        var animeModel = new application.app.models.animeDAO(connection);

        const animesResult = await animeModel.editAnime(anime);

        if (animesResult) {

            res.status(200).send("Anime editado!");

        }

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}

module.exports.deleteAnime = async function (application, req, res) {

    try {

        var {idAnime} = req.params;

        console.log(idAnime);

        var connection = application.config.dbConnection;

        var animeModel = new application.app.models.animeDAO(connection);

        const animesResult = await animeModel.deleteAnime(idAnime);

        if (animesResult) {

            console.log(animesResult);

            res.status(204).send("Anime deletado!");

        }

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}


module.exports.crawlerInfo = async function (application, req, res) {

    var url = req.body.url;

    const anime = await application.app.services.crawlerAnimeService.crawlerGetAnime(url);

    //console.log(anime)

    res.send(anime);

}

module.exports.crawlerAtualizarAnime = async function (application, req, res) {

    try {

        const id_anime = req.body.id_anime;

        var connection = application.config.dbConnection;

        var animeModel = new application.app.models.animeDAO(connection);

        const animeResult = await animeModel.FindInfoAtualizacao(id_anime);

        const anime = animeResult[0][0];

        const animeInfo = {
            link: anime.link,
            dataUltimoEp: anime.dataUltimoEp.getTime(),
            dt_lancamento: anime.dt_lancamento.getTime(),
        }

        var animeParaAtualizar = {
            nome_anime : anime.nome_anime,
            qntEpsLancados : anime.eps_lancados,
            episodios : await application.app.services.crawlerAnimeService.crawlerAtualizarGetAnime(animeInfo)
        };

        res.send(animeParaAtualizar);

    } catch (e) {

        console.log(e);

        res.status(500).send(e);

    }
}







