// intall express joi @joi/date sequelize mysql2 axios

const express = require("express");

const app = express();
app.set("port", 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const conn = new Sequelize("", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

const jwt = require("jsonwebtoken");
const JWT_KEY = "WebServiceT7";

const User = require("./models/User");
const Subscription = require("./models/Subscription");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Notification = require("./models/Notification");

// -------------------------------------------------------

// 1

async function isEmailUnique(email) {
	let user = await User.findOne({
		where: {
			email_address: email,
		},
	});

	if (!user) {
		return true;
	}

	return false;
}

async function generateUserID() {
	let tempID = "USR";

	// Find Last ID
	let users = await User.findAll({
		where: {
			user_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (users.length > 0) {
		users.forEach((user) => {
			let user_id = user.user_id;
			lastID = user_id.substring(3);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

function validateEmail(email) {
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}

app.post("/api/login", async (req, res) => {
	let { email_address, password, type, display_name } = req.body;

	let mode = "Register";

	if (!type || !display_name) {
		mode = "Login";
	}

	if (!email_address || !password) {
		return res.status(400).send({
			message: "Field email_address & password wajib diisi.",
		});
	}

	if (validateEmail(email_address) == false) {
		return res.status(400).send({
			message: "Email format invalid.",
		});
	}

	if (mode == "Register") {
		// Register

		let newType = type.toUpperCase();
		if (newType != "J" && newType != "E") {
			return res.status(400).send({
				message: "Invalid Type Value. [J,E]",
			});
		}

		if ((await isEmailUnique(email_address)) == false) {
			return res.status(400).send({
				message: "Email address is already registered!",
			});
		}

		let job;
		if (newType == "J") {
			job = "Job Seeker";
		} else if (newType == "E") {
			job = "Employer";
		}

		// Generate ID
		let newID = await generateUserID();

		// Insert
		try {
			user = await User.create({
				user_id: newID,
				email_address: email_address,
				password: password,
				type: job,
				display_name: display_name,
				balance: 0,
			});
		} catch (error) {
			return res.status(400).send({
				message: "Insert Failed",
				error,
			});
		}

		// Token
		let token = jwt.sign(
			{
				user_id: newID,
				type: job,
			},
			JWT_KEY
		);

		return res.status(201).send({
			user_id: newID,
			email_address: email_address,
			display_name: display_name,
			type: job,
			token: token,
		});
	} else {
		// Login

		let user = await User.findOne({
			where: {
				email_address: email_address,
			},
		});

		if (!user) {
			return res.status(404).send({
				message: "User not found!",
			});
		}

		if (password != user.password) {
			return res.status(400).send({
				message: "Incorrect password",
			});
		}

		let user_id = user.user_id;
		let job = user.type;

		let token = jwt.sign(
			{
				user_id: user_id,
				type: job,
			},
			JWT_KEY
		);

		return res.status(201).send({
			email_address: email_address,
			token: token,
		});
	}
});

// 2

async function cekToken(req, res, next) {
	const token = req.headers["x-auth-token"];
	if (!token) {
		return res.status(403).send({
			message: "Unauthorized",
		});
	}

	let tempUser;
	try {
		tempUser = jwt.verify(token, JWT_KEY);
	} catch (error) {
		console.log(error);
		return res.status(403).send({
			message: "Unauthorized",
		});
	}

	let user = await User.findByPk(tempUser.user_id);
	req.user = user;
	next();
}

app.post("/api/subscribe", cekToken, async (req, res) => {
	let user = req.user;
	let user_id = user.user_id;
	let balance = parseInt(user.balance);

	console.log(balance);
	if (balance < 50000) {
		return res.status(400).send({
			message: "Insufficient amount of balance",
		});
	}
	let newBalance = balance - 50000;
	let quota;

	if (user.type == "Job Seeker") {
		// Job Seeker
		let feature = "Personalized Notifications";

		let subscribe = await Subscription.findOne({
			where: {
				[Op.and]: {
					user_id: user_id,
					feature: feature,
				},
			},
		});

		if (!subscribe) {
			// Create
			quota = 20;
			try {
				tempSubs = await Subscription.create({
					user_id: user_id,
					feature: feature,
					quota: quota,
				});
			} catch (error) {
				return res.status(400).send({
					message: "Insert Failed",
					error,
				});
			}
		} else {
			// Update
			quota = parseInt(subscribe.quota) + 20;
			try {
				tempSubs = await Subscription.update(
					{
						quota: quota,
					},
					{
						where: {
							[Op.and]: {
								user_id: user_id,
								feature: feature,
							},
						},
					}
				);
			} catch (error) {
				return res.status(400).send({
					message: "Update Failed",
					error,
				});
			}
		}

		// Update User
		try {
			tempUser = await User.update(
				{
					balance: newBalance,
				},
				{
					where: {
						user_id: user_id,
					},
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}

		return res.status(200).send({
			new_balance: newBalance,
			personalized_notifications_left: quota,
			message: "Subscription successfully done",
		});
	} else {
		// Employer

		let feature = "Promoted Jobs";

		let subscribe = await Subscription.findOne({
			where: {
				[Op.and]: {
					user_id: user_id,
					feature: feature,
				},
			},
		});

		if (!subscribe) {
			// Create
			quota = 5;
			try {
				tempSubs = await Subscription.create({
					user_id: user_id,
					feature: feature,
					quota: quota,
				});
			} catch (error) {
				return res.status(400).send({
					message: "Insert Failed",
					error,
				});
			}
		} else {
			// Update
			quota = parseInt(subscribe.quota) + 5;
			try {
				tempSubs = await Subscription.update(
					{
						quota: quota,
					},
					{
						where: {
							[Op.and]: {
								user_id: user_id,
								feature: feature,
							},
						},
					}
				);
			} catch (error) {
				return res.status(400).send({
					message: "Update Failed",
					error,
				});
			}
		}

		// Update User
		try {
			tempUser = await User.update(
				{
					balance: newBalance,
				},
				{
					where: {
						user_id: user_id,
					},
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}

		return res.status(200).send({
			new_balance: newBalance,
			promoted_jobs_left: quota,
			message: "Subscription successfully done",
		});
	}
});

// 3

async function generateJobID() {
	let tempID = "JOB";

	// Find Last ID
	let jobs = await Job.findAll({
		where: {
			job_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (jobs.length > 0) {
		jobs.forEach((job) => {
			let job_id = job.job_id;
			lastID = job_id.substring(3);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

app.post("/api/jobs", cekToken, async (req, res) => {
	let user = req.user;
	if (user.type != "Employer") {
		return res.status(403).send({
			message: "Unauthorized Access",
		});
	}
	let user_id = user.user_id;
	let subscribe = await Subscription.findOne({
		where: {
			user_id: user_id,
		},
	});
	let quota;
	if (!subscribe) {
		quota = 0;
	} else {
		quota = subscribe.quota;
	}

	let { title, description, salary_range_from, salary_range_to, promoted } = req.body;

	if (!title || !salary_range_from || !salary_range_to) {
		return res.status(400).send({
			message: "Field [title,salary_range_from,salary_range_to] wajib diisi.",
		});
	}
	if (/^\d+$/.test(salary_range_from) == false || /^\d+$/.test(salary_range_to) == false) {
		return res.status(400).send({
			message: "Invalid Salary Value.",
		});
	}
	salary_range_from = parseInt(salary_range_from);
	salary_range_to = parseInt(salary_range_to);
	if (salary_range_from < 0 || salary_range_to < 0 || salary_range_to < salary_range_from) {
		return res.status(400).send({
			message: "Invalid Salary Value.",
		});
	}
	if (!description) {
		description = "";
	}
	if (!promoted) {
		promoted = "N";
	}
	promoted = promoted.toUpperCase();
	if (promoted) {
		if (promoted != "Y" && promoted != "N") {
			return res.status(400).send({
				message: "Invalid Promoted Value.",
			});
		}
	}

	let newQuota = quota;
	if (promoted == "Y") {
		// Update Subs
		if (quota < 1) {
			return res.status(400).send({
				message: "Promoted token tidak cukup.",
			});
		}
		newQuota = quota - 1;
		try {
			tempSubs = await Subscription.update(
				{
					quota: newQuota,
				},
				{
					where: {
						user_id: user_id,
					},
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}
	}

	if (promoted == "N") {
		promoted = "No";
	} else if (promoted == "Y") {
		promoted = "Yes";
	}

	let newID = await generateJobID();

	// Insert
	try {
		job = await Job.create({
			job_id: newID,
			user_id: user_id,
			title: title,
			description: description,
			salary_range_from: salary_range_from,
			salary_range_to: salary_range_to,
			promoted: promoted,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	// Notifications
	let seekers = await User.findAll({
		where: {
			type: "Job Seeker",
		},
	});

	for (let i = 0; i < seekers.length; i++) {
		const seeker = seekers[i];
		let job_fields = [];
		if (seeker.job_fields != null) {
			job_fields = JSON.parse(seeker.job_fields);
		} else {
			continue;
		}

		let notification = false;
		for (let j = 0; j < job_fields.length; j++) {
			const jobField = job_fields[j];

			if (title.includes(jobField) || description.includes(jobField)) {
				notification = true;
			}
		}

		let subscribe = await Subscription.findOne({
			where: {
				user_id: seeker.user_id,
			},
		});

		if (subscribe) {
			let quota = subscribe.quota;
			if (quota < 1) {
				continue;
			}

			let notif = {
				type: "Personalized",
				status: "Match",
				job_id: newID,
				title: title,
			};

			// Insert
			try {
				notifs = await Notification.create({
					user_id: seeker.user_id,
					info: notif,
				});
			} catch (error) {
				return res.status(400).send({
					message: "Insert Failed",
					error,
				});
			}

			// Update
			let newQuota = quota - 1;

			try {
				subs = await Subscription.update(
					{
						quota: newQuota,
					},
					{
						where: {
							user_id: seeker.user_id,
						},
					}
				);
			} catch (error) {
				return res.status(400).send({
					message: "Update Failed",
					error,
				});
			}
		}
	}

	return res.status(201).send({
		job_id: newID,
		title: title,
		promoted: promoted,
		promoted_jobs_count: newQuota,
	});
});

// 4

app.put("/api/users", cekToken, async (req, res) => {
	let user = req.user;
	let user_id = user.user_id;
	let userBalance = parseInt(user.balance);

	let { balance, job_fields } = req.body;

	if (balance) {
		balance = parseInt(balance);
		if (/^\d+$/.test(balance) == false || balance < 0) {
			return res.status(400).send({
				message: "Invalid Balance Value.",
			});
		}
	}

	if (user.type == "Job Seeker") {
		// Job Seeker
		let userJobs = [];

		if (user.job_fields != null) {
			userJobs = JSON.parse(user.job_fields);
		}

		if (balance && job_fields) {
			// ALL

			let newBalance = userBalance + balance;

			// Update
			try {
				tempUser = await User.update(
					{
						balance: newBalance,
						job_fields: job_fields,
					},
					{
						where: {
							user_id: user_id,
						},
					}
				);
			} catch (error) {
				return res.status(400).send({
					message: "Update Failed",
					error,
				});
			}

			return res.status(200).send({
				prev_balance: userBalance,
				new_balance: newBalance,
				job_fields: job_fields,
				message: "Account successfully updated",
			});
		} else if (job_fields) {
			// Job Fields

			// Update
			try {
				tempUser = await User.update(
					{
						job_fields: job_fields,
					},
					{
						where: {
							user_id: user_id,
						},
					}
				);
			} catch (error) {
				return res.status(400).send({
					message: "Update Failed",
					error,
				});
			}

			return res.status(200).send({
				job_fields: job_fields,
				message: "Account successfully updated",
			});
		} else if (balance) {
			// Balance

			let newBalance = userBalance + balance;

			// Update
			try {
				tempUser = await User.update(
					{
						balance: newBalance,
					},
					{
						where: {
							user_id: user_id,
						},
					}
				);
			} catch (error) {
				return res.status(400).send({
					message: "Update Failed",
					error,
				});
			}

			return res.status(200).send({
				prev_balance: userBalance,
				new_balance: newBalance,
				message: "Account successfully updated",
			});
		}
	} else {
		// Employer

		if (!balance) {
			return res.status(400).send({
				message: "Field Kosong!",
			});
		}

		let newBalance = userBalance + balance;

		// Update
		try {
			tempUser = await User.update(
				{
					balance: newBalance,
				},
				{
					where: {
						user_id: user_id,
					},
				}
			);
		} catch (error) {
			return res.status(400).send({
				message: "Update Failed",
				error,
			});
		}

		return res.status(200).send({
			prev_balance: userBalance,
			new_balance: newBalance,
			message: "Account successfully updated",
		});
	}
});

// 5

app.get("/api/jobs", cekToken, async (req, res) => {
	let user = req.user;
	if (user.type != "Job Seeker") {
		return res.status(403).send({
			message: "Unauthorized Access",
		});
	}
	let user_id = user.user_id;

	let promotedJobs = await Job.findAll({
		where: {
			promoted: "Y",
		},
		order: [["job_id", "DESC"]],
	});
	let unpromotedJobs = await Job.findAll({
		where: {
			promoted: "N",
		},
		order: [["job_id", "DESC"]],
	});

	let allJobs = promotedJobs.length + unpromotedJobs.length;

	let tempJobs = [];

	let count = 0;
	for (let i = 0; i < allJobs; i++) {
		if (unpromotedJobs.length == 0) {
			count = 1;
		} else {
			count++;
		}

		if (count <= 2 && promotedJobs.length != 0) {
			tempJobs.push(promotedJobs[0]);
			promotedJobs.splice(0, 1);
		} else if (unpromotedJobs.length != 0) {
			tempJobs.push(unpromotedJobs[0]);
			unpromotedJobs.splice(0, 1);
		}

		if (count == 7) {
			count = 0;
		}
	}

	let result = [];

	for (let i = 0; i < tempJobs.length; i++) {
		const job = tempJobs[i];

		let job_id = job.job_id;
		let title = job.title;

		let tempUserID = job.user_id;
		let tempUser = await User.findOne({
			where: {
				user_id: tempUserID,
			},
		});

		let byUser = tempUser.display_name;
		let salaryRange = job.salary_range_from.toString() + "-" + job.salary_range_to.toString();
		let promoted;
		if (job.promoted == "Y") {
			promoted = "Yes";
		} else if (job.promoted == "N") {
			promoted = "No";
		}

		let data = {
			job_id: job_id,
			title: title,
			by: byUser,
			salary_range: salaryRange,
			promoted: promoted,
		};

		result.push(data);
	}

	return res.status(200).send({
		jobs: result,
	});
});

// 6

app.get("/api/notifications", cekToken, async (req, res) => {
	let user = req.user;
	let user_id = user.user_id;

	let notifs = await Notification.findAll({
		where: {
			user_id: user_id,
		},
		order: [["notification_id", "DESC"]],
	});

	let result = [];
	notifs.forEach((notif) => {
		let info = JSON.parse(notif.info);
		result.push(info);
	});

	return res.status(200).send({
		notifications: result,
	});
});

// 7

async function generateApplyID() {
	let tempID = "APL";

	// Find Last ID
	let applies = await Application.findAll({
		where: {
			application_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (applies.length > 0) {
		applies.forEach((app) => {
			let application_id = app.application_id;
			lastID = application_id.substring(3);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

app.post("/api/applications", cekToken, async (req, res) => {
	let user = req.user;
	if (user.type != "Job Seeker") {
		return res.status(403).send({
			message: "Unauthorized Access",
		});
	}
	let user_id = user.user_id;
	let jobFields = [];
	if (user.job_fields != null) {
		jobFields = JSON.parse(user.job_fields);
	}

	let { job_id } = req.body;

	if (!job_id) {
		return res.status(400).send({
			message: "Semua field wajib diisi",
		});
	}

	let job = await Job.findByPk(job_id);
	if (!job) {
		return res.status(404).send({
			message: "Job not found!",
		});
	}
	let jobTitle = job.title;
	let jobUserID = job.user_id;
	let jobUser = await User.findByPk(jobUserID);
	let jobUserName = jobUser.display_name;

	let application = await Application.findOne({
		where: {
			[Op.and]: {
				job_id: job_id,
				user_id: user_id,
			},
		},
	});
	if (application && application.status == "Pending") {
		return res.status(400).send({
			message: "You have an ongoing pending application on this job",
		});
	}

	// Create New
	if (!application) {
		let newID = await generateApplyID();

		try {
			apply = await Application.create({
				application_id: newID,
				job_id: job_id,
				user_id: user_id,
				status: "Pending",
			});
		} catch (error) {
			return res.status(400).send({
				message: "Insert Failed",
				error,
			});
		}

		// Notification
		let notif = {
			application_id: newID,
			name: user.display_name,
			applying_to: jobTitle,
			job_fields: jobFields,
		};

		// Create
		try {
			notifs = await Notification.create({
				user_id: jobUserID,
				info: notif,
			});
		} catch (error) {
			return res.status(400).send({
				message: "Insert Failed",
				error,
			});
		}

		return res.status(201).send({
			application_id: newID,
			applying_to: jobTitle,
			by: jobUserName,
		});
	}
});

// 8

app.put("/api/applications/:application_id", cekToken, async (req, res) => {
	let user = req.user;
	if (user.type != "Employer") {
		return res.status(403).send({
			message: "Unauthorized Access",
		});
	}
	let user_id = user.user_id;

	let { application_id } = req.params;
	let { action } = req.body;

	if (!action || !application_id) {
		return res.status(400).send({
			message: "Semua field wajib diisi",
		});
	}

	action = action.toLowerCase();
	if (action != "acc" && action != "dec") {
		return res.status(400).send({
			message: "Invalid Status Value. [acc,dec]",
		});
	}

	let application = await Application.findByPk(application_id);
	if (!application) {
		return res.status(404).send({
			message: "Application not found",
		});
	}
	let jobID = application.job_id;
	let job = await Job.findByPk(jobID);
	let jobTitle = job.title;
	let userID = job.user_id;

	if (user_id != userID) {
		return res.status(400).send({
			message: "This application doen't belong to you",
		});
	}

	let status;
	if (action == "acc") {
		status = "Accepted";
	} else if (action == "dec") {
		status = "Declined";
	}

	// Update
	try {
		apply = await Application.update(
			{
				status: status,
			},
			{
				where: {
					application_id: application_id,
				},
			}
		);
	} catch (error) {
		return res.status(400).send({
			message: "Update Failed",
			error,
		});
	}

	// Job Seeker
	let seekerID = application.user_id;
	let seeker = await User.findByPk(seekerID);
	let seekerName = seeker.display_name;

	// Notification

	let notif = {
		type: "Application",
		status: status,
		job_id: jobID,
		title: jobTitle,
	};

	// Create
	try {
		notifs = await Notification.create({
			user_id: seekerID,
			info: notif,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(200).send({
		application_id: application_id,
		status: status,
		name: seekerName,
	});
});

// -------------------------------------------------------

app.listen(app.get("port"), () => {
	console.log(`Server started at http://localhost:${app.get("port")}`);
});
