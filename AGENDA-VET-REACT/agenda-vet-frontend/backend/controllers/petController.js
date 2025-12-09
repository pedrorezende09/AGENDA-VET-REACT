const { Pet, ConsultaVet, sequelize } = require('../models'); 
const { Op } = require('sequelize'); 

exports.createPet = async (req, res) => {
    try {
        const novoPet = await Pet.create(req.body);
        return res.status(201).json(novoPet);
    } catch (error) {
        console.error('Erro ao criar pet:', error);
        return res.status(500).json({ message: 'Erro interno ao criar o pet.', error: error.message });
    }
};

exports.getAllPets = async (req, res) => {
    try {
        const searchTerm = req.query.busca;
        console.log(`[DEBUG] Termo de busca recebido: "${searchTerm}"`);
        
        let whereClause = {};
        if (searchTerm) {
            console.log("[DEBUG] Ativando filtro de busca...");
            
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            whereClause = {
                [Op.or]: [
                    { 
                        [Op.and]: sequelize.where(
                            sequelize.fn('LOWER', sequelize.col('nome')),
                            { [Op.like]: `%${lowerCaseSearchTerm}%` } 
                        )
                    },
                    { 
                        [Op.and]: sequelize.where(
                            sequelize.fn('LOWER', sequelize.col('dono')),
                            { [Op.like]: `%${lowerCaseSearchTerm}%` } 
                        )
                    }
                ]
            };
        } else {
            console.log("[DEBUG] Nenhum termo de busca. Retornando todos os pets.");
        }

        const pets = await Pet.findAll({
            where: whereClause,
            order: [['nome', 'ASC']] 
        });
        
        console.log(`[DEBUG] Resultados encontrados: ${pets.length}`);

        return res.status(200).json(pets);

    } catch (error) {
        console.error('Erro ao listar pets:', error);
        return res.status(500).json({ 
            message: 'Erro interno do servidor ao listar pets.',
            error: error.message 
        });
    }
};


exports.getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await Pet.findByPk(id); 

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado.' });
        }

        return res.status(200).json(pet);

    } catch (error) {
        console.error('Erro ao buscar pet:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar pet.', error: error.message });
    }
};

exports.updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Pet.update(req.body, {
            where: { id_pet: id } 
        });

        if (updated) {
            const updatedPet = await Pet.findByPk(id);
            return res.status(200).json(updatedPet);
        }

        return res.status(404).json({ message: 'Pet não encontrado para atualização.' });

    } catch (error) {
        console.error('Erro ao atualizar pet:', error);
        return res.status(500).json({ message: 'Erro interno ao atualizar o pet.', error: error.message });
    }
};

exports.deletePet = async (req, res) => {
    const { id } = req.params;
    
    try {
        const pet = await Pet.findByPk(id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado para exclusão.' });
        }

        await ConsultaVet.destroy({
            where: { id_pet: id }
        });
        
        const deleted = await Pet.destroy({
            where: { id_pet: id } 
        });

        if (deleted) {
            return res.status(200).json({ message: `Pet com ID ${id} e suas consultas foram deletados com sucesso.` });
        }
        
        return res.status(404).json({ message: 'Pet não encontrado.' });

    } catch (error) {
        console.error('Erro ao deletar pet e consultas associadas:', error);
        return res.status(500).json({ message: 'Erro interno ao deletar o Pet.', error: error.message });
    }
};