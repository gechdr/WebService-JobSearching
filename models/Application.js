const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t7_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Application extends Model {}

Application.init(
	{
		application_id: {
			type: DataTypes.STRING(6),
			primaryKey: true,
			allowNull: false,
		},
    job_id: {
			type: DataTypes.STRING(6),
			allowNull: false,
		},
    user_id: {
			type: DataTypes.STRING(6),
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING(25),
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Application",
		tableName: "applications",
	}
);

module.exports = Application;