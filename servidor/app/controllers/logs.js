var dateFormat  = require('dateformat');

module.exports.getLogsCrawlerAtualizaEps = async function (application, req, res) {

    try {

        const primeiro_registro = req.body.primeiro_registro;

        console.log(primeiro_registro);

        var logsModel = new application.app.models.logs(application);

        const logsResult = await logsModel.getLogsCrawlerAtualizaEps(primeiro_registro);

        res.status(200).send(logsResult);

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}