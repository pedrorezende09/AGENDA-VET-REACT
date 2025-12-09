const { ConsultaVet, Pet, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAllConsultas = async (req, res) => {
    try {
        const consultas = await ConsultaVet.findAll({
            include: [{ 
                model: Pet, 
                as: 'donoDoPet', 
                attributes: ['id_pet', 'nome', 'dono'] 
            }],
            order: [['data', 'DESC'], ['hora', 'DESC']]
        });
        return res.status(200).json(consultas);
    } catch (error) {
        console.error('Erro ao listar consultas:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao listar consultas.', error: error.message });
    }
};

exports.createConsulta = async (req, res) => {
    try {
        const novaConsulta = await ConsultaVet.create(req.body);
        return res.status(201).json(novaConsulta);
    } catch (error) {
        console.error('Erro ao agendar consulta:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao agendar consulta.', error: error.message });
    }
};

exports.getConsultaById = async (req, res) => {
    try {
        const { id } = req.params;
        const consulta = await ConsultaVet.findByPk(id, {
            include: [{ 
                model: Pet, 
                as: 'donoDoPet',
                attributes: ['id_pet', 'nome', 'especie', 'dono'] 
            }]
        });

        if (!consulta) {
            return res.status(404).json({ message: 'Consulta não encontrada.' });
        }

        return res.status(200).json(consulta);

    } catch (error) {
        console.error('Erro ao buscar consulta por ID:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar consulta.', error: error.message });
    }
};

exports.updateConsulta = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await ConsultaVet.update(req.body, {
            where: { id_consulta: id }
        });

        if (updated) {
            const updatedConsulta = await ConsultaVet.findByPk(id, {
                include: [{ model: Pet, as: 'donoDoPet' }]
            });
            return res.status(200).json({ message: 'Consulta atualizada com sucesso!', consulta: updatedConsulta });
        }
        
        return res.status(404).json({ message: 'Consulta não encontrada para atualização.' });

    } catch (error) {
        console.error('Erro ao atualizar consulta:', error);
        return res.status(500).json({ message: 'Erro interno ao atualizar a consulta.', error: error.message });
    }
};

exports.getConsultasBySearch = async (req, res) => {
    const { termo } = req.query; 
    
    if (!termo || termo.trim() === '') {
        return exports.getAllConsultas(req, res);
    }

    const searchTerm = `%${termo.toLowerCase()}%`;

    try {
        const consultas = await ConsultaVet.findAll({
            include: [{ 
                model: Pet, 
                as: 'donoDoPet', 
                attributes: ['id_pet', 'nome', 'dono'],
                required: true 
            }],
            where: {
                [Op.or]: [
                    sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('ConsultaVet.veterinario')),
                        { [Op.like]: searchTerm }
                    ),
                    sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('donoDoPet.nome')),
                        { [Op.like]: searchTerm }
                    ),
                    sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('donoDoPet.dono')),
                        { [Op.like]: searchTerm }
                    ),
                ]
            },
            order: [['data', 'ASC'], ['hora', 'ASC']]
        });

        if (consultas.length === 0) {
            return res.status(404).json({ message: `Nenhuma consulta encontrada para o termo: ${termo}` });
        }
        
        return res.status(200).json(consultas);
    } catch (error) {
        console.error('Erro ao buscar consultas:', error);
        return res.status(500).json({ 
            message: 'Erro interno do servidor ao buscar consultas.', 
            error: error.message 
        });
    }
};

exports.deleteConsulta = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await ConsultaVet.destroy({
            where: { id_consulta: id }
        });

        if (deleted) {
            return res.status(204).send();
        }
        
        return res.status(404).json({ message: 'Consulta não encontrada.' });

    } catch (error) {
        console.error('Erro ao deletar consulta:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao deletar consulta.', error: error.message });
    }
};