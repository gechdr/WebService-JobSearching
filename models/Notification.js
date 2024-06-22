const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t7_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Notification extends Model {}

Notification.init(
	{
		notification_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
      autoIncrement: true,
			allowNull: false,
		},
    user_id: {
			type: DataTypes.STRING(6),
			allowNull: false,
		},
    info: {
			type: DataTypes.JSON,
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Notification",
		tableName: "notifications",
	}
);

module.exports = Notification;