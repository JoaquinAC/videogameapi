const { Genres} = require("../db");
const axios = require("axios")

const getGenresController = async () => {
  try {
    // Buscar todos los nombres de géneros existentes en la base de datos
    const existingGenres = await Genres.findAll({ attributes: ['name'], raw: true });

    // Verificar si existen géneros en la base de datos
    if (existingGenres.length === 0) {
      // Realizar la solicitud HTTP al endpoint de la API de RAWG para obtener los géneros
      const response = await axios.get('https://api.rawg.io/api/genres?key=35ff859c31824e1199457d87142be1ef');

      // Obtener los nombres de los géneros desde la respuesta y convertirlos a minúsculas
      const genreNames = response.data.results.map((genre) => genre.name.toLowerCase());
      
      // Crear un nuevo registro en la base de datos para cada género
      const createdGenres = await Promise.all(
        genreNames.map((genreName) => Genres.create({ name: genreName }))
      );

      // Obtener los nombres de los géneros creados
      const createdGenreNames = createdGenres.map((genre) => genre.name);

      // Combinar los géneros existentes y los géneros creados
      const allGenres = [...createdGenreNames];

      return allGenres;
    }

    // Si existen géneros en la base de datos, retornarlos
    return existingGenres.map((genre) => genre.name);
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener y guardar los géneros.');
  }
};

module.exports = {
    getGenresController
}
