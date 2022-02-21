const request = require('request')

const cheerio = require('cheerio')

request('http://www.imdb.com/chart/moviemeter', function (err, res, body){
    
    if(err) console.log('Erro: ' + err);

    const $ = cheerio.load(body);

    $('.lister-list tr').each(function(){

        var title = $(this).find('.titleColumn a').text().trim()

        var rating = $(this).find('.imdbRating strong').text().trim()

        console.log("Titulo: " + title);
    
    })

})