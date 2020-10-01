export default (sequelize, DataTypes) => {
    const Orders = sequelize.define('Orders', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
                as: 'userId',
            }
        },
        foodId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Foods',
                key: 'id',
                as: 'foodId',
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            required: true,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        }
    });
    Orders.associate = (models) => {
        Orders.belongsTo(models.Users, {
            foreignKey: 'userId'
        });
    };
    return Orders;
};
