const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const petRoutes = require('./routes/petRoutes'); 
const consultaRoutes = require('./routes/consultaRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
      res.send('Servidor Agenda Vet rodando com sucesso! Acesse /api/pets para ver a lista.');
});


app.use('/api/pets', petRoutes);

app.use('/api/consultas', consultaRoutes); 

const iniciarServidor = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync(); 
        console.log('💾 Modelos sincronizados com o banco de dados.');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Erro FATAL ao iniciar o servidor:', error);
        process.exit(1); 
    }
};

iniciarServidor();