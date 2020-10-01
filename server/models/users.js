export default (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
      }
    });
    Users.associate = (models) => {
      Users.hasMany(models.Orders, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    };
    return Users;
  };
  