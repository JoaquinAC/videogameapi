import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createGame, getGame, getGameGenres } from '../../redux/actions';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import './FormPage.css';

const FormPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const gameGenres = useSelector((state) => state.gameGenres);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platforms: [],
    image: '',
    releaseDate: '',
    rating: '',
    genres: [],
  });

  const error = useSelector((state) => state.error);

  // Funciones para manejar las selecciones de plataformas y géneros
  const [platformsSelected, setPlatformsSelected] = useState([]);
  const [genresSelected, setGenresSelected] = useState([]);

  const isPlatformSelected = (platform) => platformsSelected.includes(platform);
  const isGenreSelected = (genre) => genresSelected.includes(genre);

  // Al montar el componente, obtén los géneros de los juegos
  useEffect(() => {
    dispatch(getGameGenres());
  }, [dispatch]);

  // Maneja los cambios en los campos del formulario
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja el clic en un botón de plataforma
  const handlePlatformButtonClick = (platform) => {
    if (isPlatformSelected(platform)) {
      // Si la plataforma ya está en el array, la quitamos al hacer clic nuevamente
      setPlatformsSelected((prevSelected) => prevSelected.filter((p) => p !== platform));
    } else {
      // Si la plataforma no está en el array, la agregamos
      setPlatformsSelected((prevSelected) => [...prevSelected, platform]);
    }
  };

  // Maneja el clic en un botón de género
  const handleGenreButtonClick = (genre) => {
    if (isGenreSelected(genre)) {
      // Si el género ya está en el array, lo quitamos al hacer clic nuevamente
      setGenresSelected((prevSelected) => prevSelected.filter((g) => g !== genre));
    } else {
      // Si el género no está en el array, lo agregamos
      setGenresSelected((prevSelected) => [...prevSelected, genre]);
    }
  };

  // Maneja el envío del formulario
  const handleSubmit = () => {
    // Verificar si todos los campos están completos
    const { name, description, image, releaseDate, rating } = formData;
    if (
      name.trim() === '' ||
      description.trim() === '' ||
      platformsSelected.length === 0 ||
      genresSelected.length === 0 ||
      image.length < 20 ||
      releaseDate === '' ||
      rating === '' ||
      rating > 5
    ) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    // Crear el objeto JSON con los datos del nuevo videojuego
    const gameData = {
      name: name.trim().replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalizar primera letra de cada palabra
      description: description.trim().replace(/[^\w\s]/g, ''), // Eliminar caracteres especiales
      plataform: platformsSelected,
      image,
      releaseDate,
      rating: parseFloat(rating), // Convertir rating a número
      genres: genresSelected,
    };

    // Dispatch de la acción createGame con el objeto gameData
    dispatch(createGame(gameData));

    // Verificar si hay errores en el estado global (asumiendo que el reducer actualiza el estado "error" en caso de error)
    if (error === null) {
      // Mostrar un mensaje modal de éxito durante 2 segundos
      alert('Creado Con Éxito');
      dispatch(getGame())
      setTimeout(() => {
        history.push('/home'); // Redireccionar a HomePage después del éxito
      }, 2000);
    }
  };

  // Maneja el clic en el botón "Cancelar"
  const handleCancel = () => {
    history.push('/home'); // Redireccionar a HomePage
  };

  return (
   <div className='formpage-container'>

      <div className='homepage-navbar-container' >
        <Link to="/home" className="link-no-underline">
          <h1>Home</h1>
        </Link>

        <Link to="/home" className="link-no-underline">  
          <h3>Search 🔍︎</h3>
        </Link>
      </div> 

      <div className='homepage-barleft-container'>
        <Link to="/create">
              <button className="barleft-button">Crear Pokémon</button>
        </Link>  
      </div>

      <div className='form-container'>
        <div className='form-row'>
          <div className='form-area form-normal'>
            <label>Nombre</label>
            <h4>Escribe el nombre de tu juego aqui..</h4>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className='form-area form-normal'>
            <label>Descripción</label>
            <h4> ¿De que va tu juego?</h4>
            <textarea name="description" value={formData.description} onChange={handleInputChange} />
          </div>
        </div>

        <div className='form-row'>
          <div className='form-area form-normal'>
            <label>Imagen</label>
            <h4>Agrega una URL de tu juego aqui ..</h4>
            <input type="text" name="image" value={formData.image} onChange={handleInputChange} />
          </div>
          <div className='form-area'>
            <label>Fecha de Lanzamiento:</label>
            <h4>¿Cuando se publico?</h4>
            <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} />
          </div>
        </div>

        <div className='form-area center'>
          <label>Rating</label>
          <h4>¿De cuanto es su popularidad? (1 al 5)</h4>
          <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} />
        </div>

        <div className='form-area form-buttons'>
          <label>Plataformas</label>
          <h4>¿Donde se puede jugar ?</h4>
          <div className='button-container '>
            {['PC', 'PlayStation', 'Xbox', 'Apple Macintosh', 'Android', 'Linux', 'Nintendo', 'IOS', 'WEB'].map((platform) => (
              <button
                key={platform}
                onClick={() => handlePlatformButtonClick(platform)}
                className={isPlatformSelected(platform) ? 'selected' : ''}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div className='form-area form-buttons'>
          <label>Géneros</label>
          <h4>¿Que categorias pertenece?</h4>
          <div className='button-container'>
            {gameGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreButtonClick(genre)}
                className={isGenreSelected(genre) ? 'selected' : ''}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className='form-area center form-dispatch'>
          <button className='btn-dispatch' onClick={handleSubmit}>Enviar</button>
          <button className='btn-dispatch' onClick={handleCancel}>Cancelar</button>
        </div>

      </div>
  </div>
  );
};

export default FormPage;
