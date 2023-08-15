const {
    getGenresController
} = require("../controllers/genresController")


const getGenresHandler = async (req, res) => {
    try {
      const genres = await getGenresController();
      
      if (genres.length === 0) {
        // Si no se encontraron géneros, lanzar un error 404
        return res.status(404).json({ error: 'No se encontraron géneros.' });
      }
  
      res.status(200).json(genres);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los géneros.' });
    }
  };

module.exports = {
    getGenresHandler
 }
 