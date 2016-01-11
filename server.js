var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
var router = express.Router();

var app = express();

app.use(bodyParser());
mongoose.connect('mongodb://localhost/person');

var personSchema = mongoose.Schema({
    name: String,
    age: Number
});

var Person = mongoose.model('Person', personSchema);

router.route('/')
    .all(function(req, res, next) {
        // runs for all HTTP verbs first
        next();
    })
    .get(function(req, res) {
       Person.find(function(err, person) {
           if (err)
               res.send(err);
           res.send(person);
       });
    })
    .post(function(req, res) {
        var person = new Person();

        person.name = req.body.name;
        person.age = req.body.age;

        person.save(function(err) {
            if (err)
                res.send(err);
            res.send({message: "Person created"});
        });

    });

router.route('/:person_id')
    .put(function(req, res) {
        Person.findOne({_id: req.params.person_id}, function(err, person) {
            person.name = req.body.name;
            person.age = req.body.age;

            person.save(function(err) {
                if (err)
                    res.send(err);
                res.send({message: "Person updated"});
            });
        });
    })
    .delete(function(req, res) {
        Person.remove({_id: req.params.person_id}, function(err) {
            if (err)
                res.send(err);
            res.json({message: "Person deleted"});
        });
    });

app.use(router);
app.listen(port);

