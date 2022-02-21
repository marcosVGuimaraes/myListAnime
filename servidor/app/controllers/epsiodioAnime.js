var dateFormat  = require('dateformat');
const itemLista = require('../models/itemLista');

module.exports.getEpsAnime = async function (application, req, res) {

	try {

		var {id_itemLista} = req.params;

		var connection = application.config.dbConnection;

		var episodioAnimeModel = new application.app.models.episodioAnimeDAO(connection);

		const episodioAnimeResult = await episodioAnimeModel.GetEpsByIdITemLista(id_itemLista);

		res.send(episodioAnimeResult[0]);

	} catch (e) {

		console.log(e);

		res.status(500).send(e);
	}

}

module.exports.getEpsAssistidos = async function (application, req, res) {

	try {

		var {idItemLista} = req.params;

		var connection = application.config.dbConnection;

		var episodioAnimeModel = new application.app.models.episodioAnimeDAO(connection);

		const episodioAnimeResult = await episodioAnimeModel.GetEpsAssistidos(idItemLista);

		res.send(episodioAnimeResult[0]);

	} catch (e) {

		console.log(e);

		res.status(500).send(e);
	}

}

module.exports.getEpsNaoAssistidos = async function (application, req, res) {

	try {

		var {idItemLista, idAnime} = req.params;

		console.log(idItemLista)

		var connection = application.config.dbConnection;

		var episodioAnimeModel = new application.app.models.episodioAnimeDAO(connection);

		const episodioAnimeResult = await episodioAnimeModel.GetEpsNaoAssistidos(idItemLista, idAnime);

		res.send(episodioAnimeResult[0]);

	} catch (e) {

		console.log(e);

		res.status(500).send(e);
	}

}

module.exports.cadEpsAnime = async function (application, req, res) {

	try {

		var eps_anime = req.body.eps_anime;
		
		var connection = application.config.dbConnection;

		var episodioAnimeModel = new application.app.models.episodioAnimeDAO(connection);

		var animeModel = new application.app.models.anime(application);

		const episodioAnimeResult = await episodioAnimeModel.CadEpsAnime(eps_anime);

		await animeModel.atualizarStatusAnime(eps_anime[0][3]);

		res.send(episodioAnimeResult[0]);

	} catch (e) {

		console.log(e);

		res.status(500).send(e);
	}

}

module.exports.assistirEps = async function (application, req, res) {

	try {

		console.log(req.body);

		var ep_anime = req.body.ep_anime;

		var episodiosAssistidos = new application.app.models.episodiosAssistidos(application);

        const result = await episodiosAssistidos.assistirEps(ep_anime);

        res.status(result.statusCod).send(result.msg);

	} catch (e) {

		console.log(e);

		res.status(500).send(e);
	}

}

module.exports.deleteEpisodio = async function (application, req, res) {

    try {
    
        var {id} = req.params;

        console.log(id);
        
        var connection = application.config.dbConnection;

		var episodioAnimeModel = new application.app.models.episodioAnimeDAO(connection);

        const episodioResult = await episodioAnimeModel.deleteEp(id);
        
        if (episodioResult) {

            console.log(episodioResult);

            res.status(204).send("Episodio deletado!");

        }

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}