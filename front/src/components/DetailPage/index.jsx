import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';
import { getGameBDById, getGameById ,deleteGame, modifyGame, getGameGenres, getGame } from '../../redux/actions'; // Importar las acciones adecuadas
import './DetailPage.css';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const DetailPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const gameByID = useSelector((state) => state.gameByID);
  const error = useSelector((state) => state.error);
  const gameGenres = useSelector((state) => state.gameGenres);
  const [redirectToHome, setRedirectToHome] = useState(false);

  useEffect(() => {
    dispatch(getGameGenres());
    // Obtener los datos del juego según el origen del ID
    if (id.length === 36) {
      // Si el ID tiene 36 caracteres, es un UUID (BD)
      dispatch(getGameBDById(id));
    } else {
      // Si el ID tiene menos de 36 caracteres, es un ID normal (API)
      dispatch(getGameById(id));
    }
  }, [dispatch, id]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Actualizar formData con los datos del juego cuando se obtienen del store (gameByID)
    if (gameByID.length) {
      setFormData(gameByID[0]);
    }
  }, [gameByID]);

  if (redirectToHome) {
    return <Redirect to="/home" />;
  }

  const handleModifyGame = () => {
    // Validar los datos del formulario antes de modificar el juego
    if (formData.name && formData.image && formData.rating >= 0 && formData.rating <= 5) {
      // Construir el JSON con los datos modificados del juego
      const modifiedGame = {
        name: formData.name,
        description: formData.description,
        plataform: formData.plataform,
        image: formData.image,
        fechaLanzamiento: formData.fechaLanzamiento,
        rating: formData.rating,
        genres: formData.genres,
      };

      // Realizar el dispatch de la acción modifyGame para modificar el juego en la base de datos
      dispatch(modifyGame(id, modifiedGame));

      // Mostrar el mensaje de éxito si no hay error
      if (error === null) {
        alert('Modificado con éxito');
        setShowModal(false);
        dispatch(getGame())
        window.location.reload();
      } else {
        alert('No se pudo modificar el juego.');
      }
    } else {
      alert('Por favor, complete todos los campos obligatorios y asegúrese de que el rating esté entre 0 y 5.');
    }
  };

  const handleDeleteGame = (gameID) => {
    dispatch(deleteGame(gameID));
    if (error === null) {
      // Si el error es null, mostrar un mensaje de éxito y redireccionar a la página de inicio
      alert('Eliminado con éxito');
      dispatch(getGame())
      setRedirectToHome(true);
    } else {
      // Si hay un error, mostrar un mensaje de error (opcional)
      alert('No se pudo eliminar el juego.');
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePlatform = (platform) => {
    const updatedPlatforms = formData.plataform.includes(platform)
      ? formData.plataform.filter((p) => p !== platform)
      : [...formData.plataform, platform];
    setFormData({
      ...formData,
      plataform: updatedPlatforms,
    });
  };

  const handleToggleGenre = (genre) => {
    const updatedGenres = formData.genres.includes(genre)
      ? formData.genres.filter((g) => g !== genre)
      : [...formData.genres, genre];
    setFormData({
      ...formData,
      genres: updatedGenres,
    });
  };

  const renderGameDetails = () => {
    if (!gameByID.length) {
      return <div>Cargando...</div>;
    }
    const gameDetails = gameByID[0];

    return (
      <div className='details-container'>
        <div className='details-game'>
            <img src={gameDetails.image || gameDetails.img[0]} alt={gameDetails.name || gameDetails.nombre} />
            <h2><span>{gameDetails.name || gameDetails.nombre}</span></h2>
            <p>{gameDetails.description || gameDetails.descripcion}</p>
        </div>

        <div className='stats-content'>
            <div className='stats-game'>
                <p>Platforms: </p>
                <p className='plataform-content'>{gameDetails.plataform?.join(', ')}</p>
            </div>

            <div className='stats-game'>
                <p>Genres:</p>
                <p>{gameDetails.genres?.join(', ')|| gameDetails.generos?.join(', ')}</p>
            </div>

            <div className='stats-game'>
                <p>Date Released:</p>
                <p>{gameDetails.fechaLanzamiento}</p>
            </div>
            
            <div className='stats-game'>
                <p>Rating </p>
                <p>{gameDetails.rating}</p>
            </div>

            <div className='stats-game'>
                <p>Origen:</p>
                <p>{gameDetails.Origen}</p>
            </div>

            {gameDetails.origen === 'BD' && (
              <div className='stats-game buttons'>
                <button onClick={handleOpenModal}>Modificar</button>
                <button onClick={() => handleDeleteGame(gameDetails.id)}>Eliminar</button>
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className='details-principal-container'>
      <div className='homepage-navbar-container'>
      <Link to="/home" className="link-no-underline" >
        <h1>Home</h1>
      </Link>

      <Link to="/home" className="link-no-underline" >  
        <h3>Search 🔍︎</h3>
      </Link>
      </div> 

      <div className='homepage-barleft-container'>
        <Link to="/create">
              <button className="barleft-button">Crear Pokémon</button>
        </Link>  
      </div>

      {renderGameDetails()}
      {showModal && (
        <div className='modal-overlay'>
        <div className='modal-form-container'>
          <form className='modal-form'>
            <label>
              Nombre:
              <input type="text" name="name" value={formData.name || ''} placeholder={formData.name || ''} onChange={handleChange} className='form-input' />
            </label>
            <br />
            <label>
              Descripción:
              <textarea name="description" value={formData.description || ''} onChange={handleChange} className='form-textarea' />
            </label>
            <br />
            <label>
              Imagen (más de 20 caracteres):
              <input type="text" name="image" value={formData.image || ''} onChange={handleChange}  className='form-input'/>
            </label>
            <br />
            <label>
              Fecha de Lanzamiento:
              <input type="date" name="fechaLanzamiento" value={formData.fechaLanzamiento || ''} onChange={handleChange}  className='form-input'/>
            </label>
            <br />
            <label>
              Rating (0-5):
              <input type="number" name="rating" value={formData.rating || ''} onChange={handleChange}  className='form-input' />
            </label>
            <br />
            <div className='form-btn-plataformas'>
            Plataformas:
            {['PC', 'PlayStation', 'Xbox', 'Apple Macintosh', 'Android', 'Linux', 'Nintendo', 'IOS', 'WEB'].map((platform) => (
                <button
                key={platform}
                type="button" // Agregar este atributo
                onClick={() => handleTogglePlatform(platform)}
                className={formData.plataform.includes(platform) ? 'active' : ''}
                >
                {platform}
                </button>
            ))}
            </div>
            <br />
            <div className='form-btn-generos'>
            Géneros:
            {gameGenres.map((genre) => (
                <button
                key={genre}
                type="button" // Agregar este atributo
                onClick={() => handleToggleGenre(genre)}
                className={formData.genres.includes(genre) ? 'active' : ''}
                >
                {genre}
                </button>
            ))}
            </div>
            <br />
            <div className='form-div-btn'>
              <button type="button" onClick={handleModifyGame} className='btn-left'>
                ENVIAR
              </button>
              <button type="button" onClick={handleCloseModal} className='btn-right'>
                Cancelar
              </button>
            </div>
          </form>
        </div>
        </div>
      )}

    </div>
  );
};

export default DetailPage;
