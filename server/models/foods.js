export default (sequelize, DataTypes) => {
    const Foods = sequelize.define('Foods', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        picture: {
            type: DataTypes.STRING,
            required: true,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
                as: 'userId',
            }
        }
    });
    Foods.associate = (models) => {
        Foods.belongsTo(models.Users, {
            foreignKey: 'userId'
        });
    };
    return Foods;
};
