'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ConsultaVet extends Model {
    static associate(models) {
      ConsultaVet.belongsTo(models.Pet, {
        foreignKey: 'id_pet',
        as: 'pet'
      });
    }
  }

  ConsultaVet.init({
    id_consulta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_pet: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    veterinario: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Pendente'
    }
  }, {
    sequelize,
    modelName: 'ConsultaVet',
    tableName: 'ConsultaVet',
    timestamps: false
  });

  return ConsultaVet;
};