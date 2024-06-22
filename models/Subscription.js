const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t7_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Subscription extends Model {}

Subscription.init(
	{
		subscription_id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
      autoIncrement: true,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.STRING(6),
			allowNull: false,
		},
    feature: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    quota: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Subscription",
		tableName: "subscriptions",
	}
);

module.exports = Subscription;