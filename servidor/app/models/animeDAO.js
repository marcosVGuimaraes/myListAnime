// function animeDAO(connection){
	
// 	this._connection = connection;
	
// }

class animeDAO {

    constructor(connection) {
	
		this._connection = connection;  

	}

	async FindAll() {
		
		const retorno = this._connection.query("SELECT a.*, (SELECT COUNT(id_ep_anime) FROM eps_anime where eps_anime.id_anime = a.id_anime ) as eps_lancados, il.id_itemLista from animes as a LEFT JOIN item_lista as il on (a.id_anime = il.id_anime) order by a.nome_anime");
	
		return retorno;
	
	}
	
	async FindAnime(id_anime){
		
		const retorno = this._connection.query("SELECT * from animes where id_anime = " + id_anime);
	
		return retorno;
	}
	
	async FindInfoAtualizacao(id_anime){
		
		const retorno = this._connection.query("SELECT a.nome_anime, a.link, a.dt_lancamento, (SELECT eps_anime.dt_lancamento from eps_anime WHERE eps_anime.id_anime = a.id_anime ORDER BY eps_anime.dt_lancamento desc LIMIT 1) as dataUltimoEp, (SELECT COUNT(id_ep_anime) FROM eps_anime where eps_anime.id_anime = a.id_anime) as eps_lancados from animes as a where a.id_anime = " + id_anime);
	
		return retorno;
	
	}
	
	async FindStatusAnime(id_anime){
	
		const retorno = this._connection.query("SELECT a.status_anime, (SELECT COUNT(id_ep_anime) FROM eps_anime where eps_anime.id_anime = a.id_anime ) as eps_lancados, a.qnt_eps from animes as a where a.id_anime = " + id_anime);
		
		return retorno;
	
	}
	
	//Retorna os animes que estão em exibição e que não tiveram episodios cadastrados desde a ultima semana
	async FindAnimesParaCrawler(filtroData){
	
		const retorno = await this._connection.query("SELECT a.id_anime, a.nome_anime, (SELECT COUNT(id_ep_anime) FROM eps_anime where eps_anime.id_anime = a.id_anime ) as eps_lancados, (SELECT eps_anime.dt_lancamento FROM eps_anime WHERE eps_anime.id_anime = a.id_anime AND eps_anime.dt_lancamento <= '"+ filtroData +"' ORDER BY eps_anime.dt_lancamento DESC LIMIT 1) as dataUltimoEp, a.status_anime, a.dt_lancamento, a.link FROM animes as a WHERE a.status_anime = 'Em exibição' AND NOT EXISTS (SELECT eps_anime.dt_lancamento FROM eps_anime WHERE eps_anime.id_anime = a.id_anime AND eps_anime.dt_lancamento > '"+ filtroData +"')");
		
		return retorno[0];
	
	}
	
	async verificarExisteAnime(anime){
		
		const retorno = this._connection.query("Select a.id_anime from animes as a where a.nome_anime = '" + anime.nome_anime + "' and a.dt_lancamento = '"+ anime.dt_lancamento + "'  and a.link = '" + anime.link + "'");
	
		return retorno;
	
	}
	
	async verificarQntEpsAnime(id_anime){
		
		const retorno = await this._connection.query("SELECT (SELECT COUNT(id_ep_anime) from eps_anime WHERE eps_anime.id_anime = " + id_anime + ") as qnt_epsLancados, a.qnt_eps from animes as a WHERE a.id_anime =" + id_anime);
	
		return retorno[0];
	
	}
	
	async CadAnime(anime){
		
		const retorno = await this._connection.query('insert into animes set ? ', anime);
	
		return retorno;
	
	}
	
	async editAnime(anime) {
		
		const retorno = await this._connection.query("update animes SET nome_anime = '" +anime.nome_anime+ "', link = '" +anime.link+ "', dt_lancamento  = '" +anime.dt_lancamento + "', sinopse = '" +anime.sinopse+ "', nota = '" +anime.nota+ "', genero = '" +anime.genero+ "', qnt_eps = '" +anime.qnt_eps+ "', status_anime = '" +anime.status_anime+ "' where id_anime = " +anime.id_anime);
	
		return retorno;
	
	}
	
	async atualizarStatusAnime(status, id_anime) {	
		
		const retorno = await this._connection.query("update animes SET status_anime = '" +status+ "' where id_anime = " +id_anime);
	
		return retorno;
	
	}
	
	async deleteAnime(id_anime){
	
		const retorno = await this._connection.query('delete from animes where id_anime = ' + id_anime);
	
		return retorno;
	
	}

	async salvarLogAtualizacaoCrawler(log){

		const retorno = await this._connection.query('insert into log_crawler_atualizareps (id_anime_alterado, episodios_novos, mensagem_log) VALUES ("'+ log.id_animes_alterados +'", "'+ log.animes_novos +'", "' + log.mensagem_log +'")');
		
		return retorno;
	
	}

}

module.exports = function(){

	return animeDAO;

}