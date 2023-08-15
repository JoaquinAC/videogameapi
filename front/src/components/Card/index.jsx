import React, { Component } from 'react';
import './Card.css';
class Card extends Component {
  render() {
    const { id, image, name, genres } = this.props;
    console.log(genres)
    return (
      <div className="card">
        <div className="card-image">
          <img src={image} alt={name} />
        </div>
        <div className="card-content">
          <div className='card-text'>
              <p> {genres.map(genre => String(genre)).join(', ')}</p>
          </div>
          <h3>{name}</h3>
        </div>
      </div>
    );
  }
}

export default Card;