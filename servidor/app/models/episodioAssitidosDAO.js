function episodioAssitidosDAO(connection){
	this._connection = connection;
}

episodioAssitidosDAO.prototype.assistirEps = function(ep_anime){
	return this._connection.query("insert into eps_assistidos set ? ", ep_anime);
}

episodioAssitidosDAO.prototype.deleteEpAssistido = async function(id_ep_assistido){

	var retorno = await this._connection.query('delete from eps_assistidos where id_ep_assistido = ' + id_ep_assistido);

	return retorno[0];
}

module.exports = function(){
	return episodioAssitidosDAO;
}