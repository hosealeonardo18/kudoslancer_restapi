const jobseekersModel = require('../model/jobseekersModel')
const helperResponse = require('../helper/common');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/AuthHelper');
const jwt = require('jsonwebtoken');


const jobseekersController = {
	getAllJobseeker: async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 5;
			const offset = (page - 1) * limit;
			let searchParams = req.query.search || "";
			let sortBy = req.query.sortBy || "fullname";
			let sort = req.query.sort || "ASC";

			const result = await jobseekersModel.getAllJobseeker(searchParams, sortBy, sort, limit, offset)
			const { rows: [count] } = await jobseekersModel.countData();

			const totalData = parseInt(count.count);
			const totalPage = Math.ceil(totalData / limit);
			const pagination = {
				currentPage: page,
				limit: limit,
				totalData: totalData,
				totalPage: totalPage
			}

			helperResponse.response(res, result.rows, 200, "Get Data jobseeker Success!", pagination);
		} catch (error) {
			console.log(error);
		}
	},

	getDetailJobseeker: async (req, res) => {
		const id = req.params.id;

		const { rowCount } = await jobseekersModel.getDetailJobseeker(id);

		if (!rowCount) return res.json({ message: 'Data Jobseeker Not Found!' });

		jobseekersModel.getDetailJobseeker(id).then(result => {
			helperResponse.response(res, result.rows, 200, 'Get Data Success!');
		}).catch(error => {
			res.send(error);
		})
	},

	updateJobseeker: async (req, res) => {
		const image = req.file.filename;
		const id = req.params.id;
		const { fullname, email, password, no_telp, city, position, company_name, description, instagram, github } = req.body
		const PORT = process.env.PORT || 5000;
		const HOST = process.env.PGHOST || 'localhost';

		const { rowCount } = await jobseekersModel.getDetailJobseeker(id);
		if (!rowCount) return res.json({ message: 'Data Jobseeker Not Found!' });

		const idToken = req.payload.id;
		if (idToken !== id) return res.json({ message: 'Sorry, this is not your account!' });

		const data = {
			id,
			fullname,
			email,
			password,
			no_telp,
			city,
			position,
			company_name,
			description,
			instagram,
			github,
			image: `http://${HOST}:${PORT}/img/${image}`,
		};

		jobseekersModel
			.updateJobseekers(data)
			.then((result) => {
				helperResponse.response(res, result.rows, 201, `Data Jobseekers ${id} Updated!`);
			})
			.catch((error) => {
				res.send(error);
			});
	},

	deleteJobseekers: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await jobseekersModel.findId(id);

		console.log(rowCount);
		if (!rowCount) return res.json({ message: `Data Jobseeker id: ${id} Not Found!` })

		jobseekersModel.deleteJobseekers(id).then(result => {
			helperResponse.response(res, result.rows, 200, "Data Jobseeker Deleted!")
		}).catch(error => {
			res.send(error)
		})
	},

	registerJobseekers: async (req, res) => {
		try {
			const {
				fullname,
				email,
				no_telp,
				password,
				currentPassword
			} = req.body

			const { rowCount } = await jobseekersModel.findEmail(email);
			if (rowCount) return res.json({ message: "Email already use!" })

			if (password !== currentPassword) return res.json({ message: "Password not Match!" })

			const salt = bcrypt.genSaltSync(10);
			const passHash = bcrypt.hashSync(password, salt);
			const id = uuidv4();

			const data = {
				id,
				fullname,
				email,
				password: passHash,
				no_telp,
				role: 'jobseeker'
			}


			jobseekersModel.registerJobseekers(data).then(result => {
				helperResponse.response(res, result.rows, 201, "Register Jobseeker Success!");
			}).catch(error => {
				res.status(500).send(error)
			})

		} catch (error) {
			console.log(error);
		}
	},

	loginJobseekers: async (req, res) => {
		try {
			const { email, password } = req.body;
			const { rows: [cek] } = await jobseekersModel.findEmail(email);

			if (!cek) return res.json({ message: "Email Not Register!" });

			const validatePassword = bcrypt.compareSync(password, cek.password);
			if (!validatePassword) return res.json({ message: "Password Incorect" });

			delete cek.password;
			delete cek.password;
			delete cek.city;
			delete cek.position;
			delete cek.company_name;
			delete cek.description;
			delete cek.instagram;
			delete cek.github;

			let payload = {
				id: cek.id,
				email: cek.email,
				role: cek.role
			}

			cek.token = authHelper.generateToken(payload);
			cek.refreshToken = authHelper.generateRefreshToken(payload)

			helperResponse.response(res, cek, 201, "Login Successfull")

		} catch (error) {
			console.log(error);
		}
	},

	refreshTokenJobseekers: (req, res) => {
		try {
			const { refreshToken } = req.body;

			let decode = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);

			const payload = {
				email: decode.email,
				role: decode.role
			}

			const result = {
				token: authHelper.generateToken(payload),
				refreshToken: authHelper.generateRefreshToken(payload)
			}

			helperResponse.response(res, result, 200)
		} catch (error) {
			console.log(error);
		}
	},


}

module.exports = jobseekersController;