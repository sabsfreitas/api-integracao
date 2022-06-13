const express = require("express");
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/taylorswiftapi/views');

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());
const AlbumRouter = require('./taylorswiftapi/routes/albums-routes');

app.use('/', AlbumRouter);

app.listen(3000, () => console.log("Escutando na porta 3000"));