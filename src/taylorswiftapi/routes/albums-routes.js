const { Router } = require('express');
const { AlbumController } = require('../controllers/albums-controller');

const albumController = new AlbumController();

const routes = Router();

routes.post('/buscar', albumController.buscaAlbum);
routes.get('/lyrics/:songId', albumController.buscaLetra);

module.exports = routes;