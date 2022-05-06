function logCrawlerEpsAnimesDAO(connection){
	this._connection = connection;
}

logCrawlerEpsAnimesDAO.prototype.FindLogsCrawlerAtualizaEps = async function(primeiro_registro){
	
	const sql = "SELECT a.nome_anime, lc.* FROM `log_crawler_atualizareps` as lc INNER JOIN animes as a on (lc.id_anime_alterado = a.id_anime) ORDER by dt_cadastro DESC LIMIT "+primeiro_registro+",100;";

	const retorno = await this._connection.query(sql);

	return retorno;

}

module.exports = function(){
	 return logCrawlerEpsAnimesDAO;
}