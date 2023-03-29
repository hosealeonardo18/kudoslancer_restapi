const recruitersModel = require('../model/recruitersModel')
const helperResponse = require('../helper/common');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/AuthHelper');
const jwt = require('jsonwebtoken');
const { uploadPhotoCloudinary } = require('../../cloudinary')


const recruitersController = {
	getAllRecruiter: async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 5;
			const offset = (page - 1) * limit;
			let searchParams = req.query.search || "";
			let sortBy = req.query.sortBy || "fullname";
			let sort = req.query.sort || "ASC";

			const result = await recruitersModel.getAllRecruiter(searchParams, sortBy, sort, limit, offset)
			const { rows: [hidden] } = result;
			delete hidden.password;

			const { rows: [count] } = await recruitersModel.countData();

			const totalData = parseInt(count.count);
			const totalPage = Math.ceil(totalData / limit);
			const pagination = {
				currentPage: page,
				limit: limit,
				totalData: totalData,
				totalPage: totalPage
			}

			helperResponse.response(res, result.rows, 200, "Get Data Recruiter Success!", pagination);
		} catch (error) {
			console.log(error);
		}
	},

	getDetailRecruiter: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await recruitersModel.getDetailRecruiter(id);

		if (!rowCount) return res.json({ message: 'Data Jobseeker Not Found!' });

		recruitersModel.getDetailRecruiter(id).then(result => {
			helperResponse.response(res, result.rows[0], 200, 'Get Data Success!');
		}).catch(error => {
			res.send(error);
		})
	},

	updateRecruiter: async (req, res) => {
		const image = req.file.filename;

		// const image_thumbnail = req.file.filename
		const id = req.params.id;
		const { fullname, email, password, no_telp, company_name, company_field, city, description, instagram, linkedin } = req.body

		const upload = await uploadPhotoCloudinary(req.file.path)

		const { rowCount } = await recruitersModel.getDetailRecruiter(id);
		if (!rowCount) return res.json({ message: 'Data Recruiter Not Found!' });

		const idToken = req.payload.id;
		if (idToken !== id) return res.json({ message: 'Sorry, this is not your account!' });

		const salt = bcrypt.genSaltSync(10);
		const passHash = bcrypt.hashSync(password, salt);

		const data = {
			id, fullname, email, password: passHash, no_telp, company_name, company_field, city, description, instagram, linkedin, image: upload.secure_url, role: 'recruiter'
		};

		recruitersModel
			.updateRecruiter(data)
			.then((result) => {
				helperResponse.response(res, result.rows, 201, `Recruiter ${id} Updated!`);
			})
			.catch((error) => {
				console.log(error);
				res.send(error);
			});
	},

	deleteRecruiter: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await recruitersModel.findId(id);

		if (!rowCount) return res.json({ message: `Recruiter id: ${id} Not Found!` })

		recruitersModel.deleteRecruiter(id).then(result => {
			helperResponse.response(res, result.rows, 200, `Recruiter id: ${id} Deleted!`)
		}).catch(error => {
			res.send(error)
		})
	},

	registerRecruiters: async (req, res) => {
		try {
			const {
				fullname,
				email,
				company_name,
				company_field,
				no_telp,
				password,
				currentPassword
			} = req.body

			const { rowCount } = await recruitersModel.findEmail(email);
			if (rowCount) return res.json({ message: "Email already use!" })

			if (password !== currentPassword) return res.json({ message: "Password not Match!" })

			const salt = bcrypt.genSaltSync(10);
			const passHash = bcrypt.hashSync(password, salt);
			const id = uuidv4();

			const data = {
				id,
				fullname,
				email,
				company_name,
				company_field,
				no_telp,
				password: passHash,
				role: 'recruiter',
				image: 'https://res.cloudinary.com/dklpoff31/image/upload/v1680077751/default_p3c9hg.jpg'
			}

			recruitersModel.registerRecruiters(data).then(result => {
				helperResponse.response(res, result.rows, 201, "Recruiter Registered!");
			}).catch(error => {
				res.status(500).send(error)
			})

		} catch (error) {
			console.log(error);
		}
	},

	loginRecruiters: async (req, res) => {
		try {
			const { email, password } = req.body;
			const { rows: [cek] } = await recruitersModel.findEmail(email);

			if (!cek) return res.json({ message: "Email Not Register!" });

			const validatePassword = bcrypt.compareSync(password, cek.password);
			if (!validatePassword) return res.json({ message: "Password Incorrect" });

			delete cek.password;
			delete cek.city;
			delete cek.position;
			delete cek.company_name;
			delete cek.company_field;
			delete cek.description;
			delete cek.instagram;
			delete cek.linkedin;
			delete cek.image_thumbnail;

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

	refreshTokenRecruiters: (req, res) => {
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

module.exports = recruitersController;