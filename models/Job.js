const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t7_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Job extends Model {}

Job.init(
	{
		job_id: {
			type: DataTypes.STRING(6),
			primaryKey: true,
			allowNull: false,
		},
    user_id: {
			type: DataTypes.STRING(6),
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    salary_range_from: {
      type: DataTypes.INTEGER(15),
      allowNull: false
    },
    salary_range_to: {
      type: DataTypes.INTEGER(15),
      allowNull: false
    },
    promoted: {
      type: DataTypes.STRING(1),
      allowNull: false
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Job",
		tableName: "jobs",
	}
);

module.exports = Job;