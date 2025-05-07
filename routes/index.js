const routes = require('express').Router();
const lesson1Controller = require('../controllers/lesson1');

routes.get('/', lesson1Controller.worldRoute);

routes.get('/home', lesson1Controller.homeRoute);

routes.get('/hello', lesson1Controller.helloRoute);

module.exports = routes;