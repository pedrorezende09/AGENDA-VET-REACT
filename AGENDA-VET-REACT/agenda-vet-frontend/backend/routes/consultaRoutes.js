const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');


router.get('/', consultaController.getAllConsultas); 

router.get('/buscar', consultaController.getConsultasBySearch); 

router.post('/', consultaController.createConsulta);

router.get('/:id', consultaController.getConsultaById); 

router.put('/:id', consultaController.updateConsulta);

router.delete('/:id', consultaController.deleteConsulta);

module.exports = router;