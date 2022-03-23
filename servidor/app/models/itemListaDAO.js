function itemListaDAO(connection){
	this._connection = connection;
}

itemListaDAO.prototype.FindAll = async function(){
	
	const retorno = await this._connection.query("SELECT il.*, (SELECT COUNT(id_ep_anime) FROM eps_anime where eps_anime.id_anime = a.id_anime ) as eps_lancados, (SELECT COUNT(*) FROM eps_assistidos as ea INNER JOIN eps_anime ep ON (ea.id_ep_anime = ep.id_ep_anime) WHERE ep.id_anime = a.id_anime) as eps_assistidos, (SELECT eps_assistidos.dt_assistido from eps_assistidos WHERE eps_assistidos.id_itemLista = il.id_itemLista ORDER BY eps_assistidos.dt_assistido DESC LIMIT 1) as ultimaVez_assistido , a.* from item_lista as il inner join animes as a ON (il.id_anime = a.id_anime) order by a.nome_anime");

	return retorno;

}

itemListaDAO.prototype.FindAssistindo = async function(userId){

	const retorno = await this._connection.query("SELECT il.*, (SELECT COUNT(id_ep_anime) FROM eps_anime where eps_anime.id_anime = a.id_anime ) as eps_lancados, (SELECT COUNT(*) FROM eps_assistidos as ea INNER JOIN eps_anime ep ON (ea.id_ep_anime = ep.id_ep_anime) WHERE ea.id_itemLista = il.id_itemLista) as eps_assistidos, (SELECT eps_assistidos.dt_assistido from eps_assistidos WHERE eps_assistidos.id_itemLista = il.id_itemLista ORDER BY eps_assistidos.dt_assistido DESC LIMIT 1) as ultimaVez_assistido , a.* from item_lista as il inner join animes as a ON (il.id_anime = a.id_anime) inner join lista as l on (l.id_lista = il.id_lista) WHERE il.status = 'Assistindo' and l.id_usuario = " + userId + " order by a.nome_anime");

	return retorno;

}

itemListaDAO.prototype.FindById = async function(id_itemLista){
	
	const retorno = await this._connection.query("SELECT il.*, (SELECT COUNT(id_ep_anime) FROM eps_anime where eps_anime.id_anime = a.id_anime ) as eps_lancados, (SELECT COUNT(*) FROM eps_assistidos as ea INNER JOIN eps_anime ep ON (ea.id_ep_anime = ep.id_ep_anime) WHERE ep.id_anime = a.id_anime) as eps_assistidos, (SELECT eps_assistidos.dt_assistido from eps_assistidos WHERE eps_assistidos.id_itemLista = il.id_itemLista ORDER BY eps_assistidos.dt_assistido DESC LIMIT 1) as ultimaVez_assistido , a.* from item_lista as il inner join animes as a ON (il.id_anime = a.id_anime) where il.id_itemLista = " + id_itemLista);

	return retorno;

}

itemListaDAO.prototype.FindListaByUser = async function(id_usuario){

	const sql = "SELECT id_lista FROM lista WHERE id_usuario = " + id_usuario;

	console.log(sql)
	
	const retorno = await this._connection.query(sql);

	return retorno[0];

}

itemListaDAO.prototype.FindByIdAnime = async function(id_anime){

	const retorno = await this._connection.query("SELECT il.*, (SELECT qnt_eps FROM animes where animes.id_anime = il.id_anime) as qnt_eps, (SELECT COUNT(*) FROM eps_assistidos as ea INNER JOIN eps_anime ep ON (ea.id_ep_anime = ep.id_ep_anime) WHERE ep.id_anime = a.id_anime) as eps_assistidos, (SELECT eps_assistidos.dt_assistido from eps_assistidos WHERE eps_assistidos.id_itemLista = il.id_itemLista ORDER BY eps_assistidos.dt_assistido DESC LIMIT 1) as ultimaVez_assistido , a.* from item_lista as il inner join animes as a ON (il.id_anime = a.id_anime) where il.id_anime = " + id_anime +" order by a.nome_anime");

	return retorno[0];

}

itemListaDAO.prototype.FindStatusItemLista = async function(id_itemLista){
	
	const retorno = await this._connection.query("SELECT il.status, (SELECT animes.qnt_eps FROM animes where animes.id_anime = il.id_anime) as qnt_eps, (SELECT COUNT(id_ep_assistido) FROM eps_assistidos where eps_assistidos.id_itemLista = il.id_itemLista) as eps_assistidos from item_lista as il where il.id_itemLista =" + id_itemLista);

	return retorno[0];

}


itemListaDAO.prototype.addItemLista = async function(itemLista){
	
	const retorno = await this._connection.query("insert into item_lista set ? ", itemLista);

	return retorno;
}

itemListaDAO.prototype.atualizarStatusItemLista = async function(status, id_itemLista){

	const retorno = await this._connection.query("update item_lista SET status = '" +status+ "' where id_itemLista = " +id_itemLista);;

	return retorno;
}



itemListaDAO.prototype.deleteItemLista = async function(id_itemLista){
	
	const retorno = await this._connection.query('delete from item_lista where id_itemLista = ' + id_itemLista);

	return retorno;
}

module.exports = function(){
	 return itemListaDAO;
}