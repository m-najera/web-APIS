var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var userModel = require('./db/userDBModel');

router.use(bodyParser.urlencoded({
    extended: true
}))
router.use(bodyParser.json())

var verifyToken = require('./verifyToken')
var jwt = require('jsonwebtoken')
var User = require('./user')

var secret = "SuperSecretKey"

router.post('/login', (req, res) => {
    var body = req.body;
    var query = userModel.findOne({
        'email': body.email,
        'password': body.password
    });
    query.exec((err, user) => {
        if (err || !user) {
            return res.status(401).send({
                auth: false,
                token: null
            })
        }
        var loggedUser = new User(user.name, user.email, user.password);
        var token = jwt.sign(loggedUser.toJson(), secret, {
            expiresIn: 86400 // 24 horas
        });
        res.status(200).send({
            auth: true,
            token: token
        })
    })
});

router.post('/register', (req, res) => {
    var body = req.body;
    if (body.email && body.password && body.name) {
        var user = new userModel({
            name: body.name,
            email: body.email,
            password: body.password
        });
        user.save((err) => {
            if (err) return res.status(401).send("No se pudo guardar");
            res.status(200).send({
                user: user
            });
        })
    } else {
        return res.status(401).send("Datos incompletos")
    }
});

router.get('/me', verifyToken, (req, res) => {
    res.status(200).send(req.user)
})

router.post('/logout', verifyToken, (req, res) => {
    res.status(200).send({
        auth: false,
        token: null
    })
})

module.exports = router