import React from 'react';
import './LandingPage.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getGame } from '../../redux/actions.js';

const LandingPage = () => {

    const dispatch = useDispatch()
    
    useEffect(() => {        
        dispatch(getGame());
      }, [dispatch]);
    const history = useHistory();

    const goToHome = () => {
      history.push('/home');
    };

  return (
    <div className="landing-page">
      <div className="background-image"></div>
      <div className="content">
        {/* Aquí puedes agregar el contenido de tu landing page */}
        <h1 className='h1-landing'>Bienvenido</h1>
        <p className='p-landing'>"La nostalgia del juego perdura en cada rincón de nuestra historia."</p>
        <button className='btn-landing' onClick={goToHome}>Ir a la página de inicio</button>
      </div>
    </div>
  );
};

export default LandingPage;