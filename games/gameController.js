var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var gameModel = require('../db/gameDBModel')

router.use(bodyParser.urlencoded({
    extended: true
}))
var verifyToken = require('../verifyToken')


router.post('/', verifyToken, (req, res) => {
    var body = req.body;
    if (!body.name || !body.year || !body.genre) {
        return res.status(400).send('Bad format')
    }
    var game = new gameModel({
        id: body.id,
        name: body.name,
        year: body.year,
        genre: body.genre
    })
    game.save((err) => {
        if (err) return res.status(401).send("No se pudo guardar");
        res.status(201).send({
            game: game
        });
    })
})

router.get('/:id', verifyToken, (req, res) => {
    var query = gameModel.findOne({ "id": req.params.id });
    query.exec((err, game) => {
        if (err || !game) {
            return res.status(404).send('Game not found');
        }
        res.status(200).send(game)
    })
})

router.patch('/:id', verifyToken, (req, res) => {
    var body = req.body;
    var updates = {};
    if (body.name) {
        updates.name = body.name;
    }
    if (body.year) {
        updates.year = body.year;
    }
    if (body.genre) {
        updates.genre = body.genre;
    }
    var query = gameModel.findOneAndUpdate({ "id": req.params.id }, updates, { new: true });
    query.exec((err, game) => {
        if (err || !game) {
            return res.status(404).send('Game not found');
        }
        res.status(200).send(game)
    })
})

router.delete('/:id', verifyToken, (req, res) => {
    var query = gameModel.findOneAndDelete({ "id": req.params.id });
    query.exec((err, game) => {
        if (err || !game) {
            return res.status(404).send('Game not found');
        }
        res.status(200).send('Game deleted')
    })

})

router.get('/', verifyToken, (req, res) => {
    var query = gameModel.find().sort("id");
    query.exec((err, games) => {
        if (err || !games) {
            return res.status(404).send('No Games');
        }
        res.status(200).send(games)
    })
})

module.exports = router