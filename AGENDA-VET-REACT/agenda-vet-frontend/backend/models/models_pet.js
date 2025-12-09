module.exports = (sequelize, DataTypes) => {
    const Pet = sequelize.define('Pet', {
        id_pet: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        nome: { type: DataTypes.STRING(100), allowNull: false },
        especie: { type: DataTypes.STRING(50), allowNull: false },
        raca: { type: DataTypes.STRING(50), allowNull: false },
        idade: { type: DataTypes.INTEGER, allowNull: false },
        dono: { type: DataTypes.STRING(100), allowNull: false }
    }, {
        tableName: 'Pet',
        timestamps: false
    });
    return Pet;
};