function episodioAnimeDAO(connection){
	this._connection = connection;
}

episodioAnimeDAO.prototype.FindAll = function(){
	return this._connection.query("SELECT * from eps_anime");
}

episodioAnimeDAO.prototype.FindByIdAnime = function(id_anime){
	return this._connection.query("SELECT * from eps_anime WHERE id_anime = " + id_anime);
}

episodioAnimeDAO.prototype.CadEpsAnime = function(eps_anime){

	console.log(eps_anime)

    return this._connection.query("insert into eps_anime (numero_ep, nome_ep, dt_lancamento, id_anime)  value ? ", [eps_anime]);

}

episodioAnimeDAO.prototype.GetEpsByIdITemLista = function(id_itemLista){
	return this._connection.query('SELECT eps.id_ep_anime, eps.nome_ep, eps.numero_ep, ea.id_ep_assistido, ea.dt_assistido from eps_anime as eps LEFT JOIN eps_assistidos as ea on (ea.id_ep_anime = eps.id_ep_anime) WHERE ea.id_itemLista = ' + id_itemLista);
}

episodioAnimeDAO.prototype.GetEpsAssistidos = function(id_itemLista){
	return this._connection.query('SELECT ea.*, eps.nome_ep, eps.numero_ep from eps_assistidos as ea INNER JOIN eps_anime as eps on (ea.id_ep_anime = eps.id_ep_anime) WHERE ea.id_itemLista = ' + id_itemLista);
}

episodioAnimeDAO.prototype.GetEpsNaoAssistidos = function(id_itemLista, id_anime){
	return this._connection.query('SELECT * from eps_anime as eps WHERE eps.id_ep_anime not IN (SELECT epa.id_ep_anime from eps_assistidos epa WHERE epa.id_itemLista =' + id_itemLista +') and eps.id_anime = ' + id_anime);
}

module.exports = function(){
	return episodioAnimeDAO;
}