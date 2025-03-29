const axios = require('axios');

class AlbumController {
    async buscaAlbum(req, res) {
        try {
            const { album } = req.body;
    
            if (!album) {
                return res.status(400).send("É necessário fornecer um nome de álbum.");
            }
    
            const albumEncontrado = await buscaAlbumID(album);
    
            if (!albumEncontrado) {
                return res.render("albumAll", { 
                    albumPesquisado: album, 
                    erro: "Álbum não encontrado. ;(",
                    musicas: [] 
                });
            }
    
            const musicas = await buscaMusicasDoAlbum(albumEncontrado.id);
    
            if (musicas.length === 0) {
                return res.render("albumAll", { 
                    albumPesquisado: albumEncontrado.title, 
                    erro: "Nenhuma música encontrada para esse álbum. ;(" 
                });
            }
    
            return res.render("albumAll", { 
                albumPesquisado: albumEncontrado.title, 
                musicas: musicas.length > 0 ? musicas : [],
                erro: null
            });
    
        } catch (error) {
            console.error("Erro ao buscar álbum:", error);
            res.status(500).send("Erro interno no servidor.");
            res.render("albumAll", {
                erro: "Erro interno no servidor."
            });
        }
    }    
}

const buscaAlbumID = async (titulo) => {
    const URL = "https://taylor-swift-api.sarbo.workers.dev/albums";

    try {
        const response = await axios.get(URL);
        const albums = response.data;

        const albumEncontrado = albums.find(album => album.title.toLowerCase() === titulo.toLowerCase());

        if (albumEncontrado) {
            return {
                id: albumEncontrado.album_id,
                title: albumEncontrado.title,
                url: `https://taylor-swift-api.sarbo.workers.dev/albums/${albumEncontrado.album_id}`
            };
        } else {
            console.log("Álbum não encontrado!");
            return null;
        }
    } catch (err) {
        console.error("Erro ao buscar álbuns:", err);
        return null;
    }
};

const buscaMusicasDoAlbum = async (albumId) => {
    const URL = `https://taylor-swift-api.sarbo.workers.dev/albums/${albumId}`;

    try {
        const resposta = await axios.get(URL);
        return Array.isArray(resposta.data) ? resposta.data : [];
    } catch (error) {
        console.error("Erro ao buscar músicas:", error);
        return [];
    }
};




module.exports = { AlbumController, buscaAlbumID, buscaMusicasDoAlbum };
