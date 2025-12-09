const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('agenda_vet', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false 
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Banco de dados autenticado com sucesso!');

        const { Pet, ConsultaVet } = require('../models'); 

        await sequelize.sync({ alter: true });
        console.log("✅ Tabelas sincronizadas!");

    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        throw error; 
    }
};

module.exports = { sequelize, connectDB };