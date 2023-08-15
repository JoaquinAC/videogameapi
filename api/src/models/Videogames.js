const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Videogames', {
    id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es requerido.'
        },
        len: {
          args: [1, 40],
          msg: 'El nombre debe tener entre 1 y 40 caracteres.'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La descripcion es requerida.'
        }
      }
    },
    plataform: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [], // Puedes establecer un valor predeterminado para el array vacío si lo deseas.
      validate: {
        notEmpty: {
          msg: 'Almenos 1 plataforma es requerida.',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'La imagen debe ser una URL válida.'
        }
      }
    },
    fechaLanzamiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Debe tener una fecha.'
        }
      } 
    },
    rating: {
      type: DataTypes.DECIMAL(4, 2), 
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Debe tener un rating'
        }
      }  
    },
  },
  {timestamps: false , freezeTableName: true}
  );
};