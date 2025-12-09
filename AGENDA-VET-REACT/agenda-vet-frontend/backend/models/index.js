const Sequelize = require('sequelize');
const { sequelize } = require('../config/sequelize');
const Pet = require('./models_pet')(sequelize, Sequelize.DataTypes);
const ConsultaVet = require('./models_consultaVet')(sequelize, Sequelize.DataTypes);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Pet = Pet;
db.ConsultaVet = ConsultaVet;

if (db.Pet.associate) {
    db.Pet.associate(db);
}
if (db.ConsultaVet.associate) {
    db.ConsultaVet.associate(db);
} 

db.Pet.hasMany(db.ConsultaVet, {
    foreignKey: 'id_pet',
    as: 'consultas'
});

db.ConsultaVet.belongsTo(db.Pet, {
    foreignKey: 'id_pet',
    as: 'donoDoPet'
});

module.exports = db;