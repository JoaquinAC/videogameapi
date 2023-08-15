const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Genres', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      validate: {
        isInt: {
          msg: 'El ID debe ser un número entero.',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es requerido.',
        },
        len: {
          args: [1, 50],
          msg: 'El nombre debe tener entre 1 y 255 caracteres.',
        },
      },
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  });
};