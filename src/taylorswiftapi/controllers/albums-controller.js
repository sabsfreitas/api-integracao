const axios = require('axios');

class AlbumController {
    async buscaAlbum (req, res) {

    const { album } = req.body;

    const musicas = await buscaAlbumNaAPI(album.toLowerCase());

    const groupBySong = musicas.reduce((group, musica) => {
        const { song } = musica;
        group[song] = group[song] ?? [];
        group[song].push(musica);
        return group;
      }, {});

      const albumPesquisado = req.body.album.charAt(0).toUpperCase() + req.body.album.slice(1);

    if (musicas.length !== 0) {
        return res.render('albumAll', { musicas, groupBySong, albumPesquisado });
       } else {
        return res.send('Álbum não encontrado. ;(');
       }
    }
}

const buscaAlbumNaAPI = async (album) => {

   const URL = `https://taylorswiftapi.herokuapp.com/get-all?album=${album}`;
    try {
        const resposta = await axios.get(URL);
       return resposta.data;
    } catch (error) {
        console.log({ error });
        return null;
    }
}

module.exports = { AlbumController, buscaAlbumNaAPI };