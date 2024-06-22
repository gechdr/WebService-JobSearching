const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t7_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class User extends Model {}

User.init(
	{
		user_id: {
			type: DataTypes.STRING(6),
			primaryKey: true,
			allowNull: false,
		},
		email_address: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    balance: {
      type: DataTypes.INTEGER(15),
      allowNull: false
    },
    job_fields: {
      type: DataTypes.JSON,
      allowNull: true
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "User",
		tableName: "users",
	}
);

module.exports = User;