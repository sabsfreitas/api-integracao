const { Router } = require('express');
const { AlbumController } = require('../controllers/albums-controller');

const albumController = new AlbumController();

const routes = Router();

routes.post('/buscar', albumController.buscaAlbum);

module.exports = routes;