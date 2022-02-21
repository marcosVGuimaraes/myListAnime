var app = require('./config/server')

const cron = require('node-cron')

app.listen(7700, function(){
	console.log('Servidor ON na porta 7700 no modo ' + process.env.NODE_ENV_AMBIENTE.toUpperCase() );
	
	const crawler = new app.app.models.crawler(app);
      
	cron.schedule('0 0 */1 * * *', () => {
	
		const dataCron = new Date();
	
		console.log('Execultando o job de atualizar episodios de animes em exibição! Rodando às ' + dataCron);
	
		crawler.jobAtualizarEpsSemanaisAnime();
	
	})

});