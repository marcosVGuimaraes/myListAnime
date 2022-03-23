module.exports.getLista = async function (application, req, res) {

    try {

        const userId = req.userId;

        console.log(userId);

        var itemLista = new application.app.models.itemLista(application);

        const result = await itemLista.getLista(userId);
        
        res.status(200).send(result); 


    } catch (e) {

        console.log(e);

        res.status(500).send(e);

    }
}

module.exports.addItemLista = async function (application, req, res) {

    try {

        var idAnime = req.body.id_anime;
        
        const userId = req.userId;        

        var itemLista = new application.app.models.itemLista(application);

        const result = await itemLista.addItemLista(idAnime, userId);

        console.log(result.statusCod)

        res.status(result.statusCod).send(result.msg);        
        
    } catch (e) {
        
        console.log(e);

        res.status(500).send(e);

    }
}

module.exports.deleteItemLista = async function (application, req, res) {

    try {

        var id_itemLista = req.params.id;

        var itemLista = new application.app.models.itemLista(application);

        const result = await itemLista.deleteItemLista(id_itemLista);

        console.log(result.statusCod)

        res.status(result.statusCod).send(result.msg);
        

    } catch (e) {

        console.log(e);

        res.status(500).send(e);
    }

}