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
    
            const musicas = await buscaMusicas(albumEncontrado.id);
    
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
    async buscaLetra(req, res) {
        try {
            const { songId } = req.params;
    
            if (!songId) {
                return res.status(400).send("ID da música não fornecido.");
            }
    
            const letraData = await buscaLyrics(songId);
    
            if (!letraData || !letraData.lyrics) {
                return res.render("lyricsPage", { 
                    erro: "Letra não encontrada.", 
                    lyrics: null,
                    songTitle: null
                });
            }
    
            return res.render("lyricsPage", { 
                lyrics: letraData.lyrics, 
                songTitle: letraData.song_title,
                erro: null 
            });
    
        } catch (error) {
            console.error("Erro ao buscar letra:", error);
            res.render("lyricsPage", { 
                erro: "Erro interno no servidor.", 
                lyrics: null,
                songTitle: null
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

const buscaMusicas = async (albumId) => {
    const URL = `https://taylor-swift-api.sarbo.workers.dev/albums/${albumId}`;

    try {
        const resposta = await axios.get(URL);
        const musicas = resposta.data;

        return Array.isArray(musicas) ? musicas.map(musica => ({
            id: musica.song_id, 
            title: musica.title
        })) : [];
    } catch (error) {
        console.error("Erro ao buscar músicas:", error);
        return [];
    }
};

const buscaLyrics = async (songId) => {
    const URL = `https://taylor-swift-api.sarbo.workers.dev/lyrics/${songId}`;

    try {
        const resposta = await axios.get(URL);
        const letra = resposta.data;

        return letra ? { song_title: letra.song_title, lyrics: letra.lyrics } : null;
    } catch (error) {
        console.error("Erro ao buscar letra:", error);
        return null;
    }
};

module.exports = { AlbumController, buscaAlbumID, buscaMusicas, buscaLyrics };
