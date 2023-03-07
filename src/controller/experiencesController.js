const experiencesModel = require('../model/experiencesModel')
const helperResponse = require('../helper/common');
const { v4: uuidv4 } = require('uuid');
const { uploadPhotoCloudinary } = require('../../cloudinary')

const experiencesController = {
	getAllExperience: async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 5;
			const offset = (page - 1) * limit;
			let searchParams = req.query.search || "";
			let sortBy = req.query.sortBy || "company_name";
			let sort = req.query.sort || "ASC";

			const result = await experiencesModel.getAllExperience(searchParams, sortBy, sort, limit, offset)
			const { rowCount } = result;

			// if (!rowCount) return res.json({ message: "Data Not Found!" })

			const { rows: [count] } = await experiencesModel.countData();

			const totalData = parseInt(count.count);
			const totalPage = Math.ceil(totalData / limit);
			const pagination = {
				currentPage: page,
				limit: limit,
				totalData: totalData,
				totalPage: totalPage
			}

			helperResponse.response(res, result.rows, 200, "Get Data Experiences Success!", pagination);
		} catch (error) {
			console.log(error);
		}
	},

	getDetailExperience: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await experiencesModel.getDetailExperience(id);

		if (!rowCount) return res.json({ message: 'Data Experiences Not Found!' });

		experiencesModel.getDetailExperience(id).then(result => {
			helperResponse.response(res, result.rows, 200, 'Get Data Success!');
		}).catch(error => {
			res.send(error);
		})
	},

	getDetailExperienceJobseeker: async (req, res) => {
		const id = req.params.id;

		experiencesModel.getDetailExperienceJobseeker(id).then(result => {
			helperResponse.response(res, result.rows, 200, 'Get Data Success!');
		}).catch(error => {
			res.send(error);
		})
	},

	createExperience: async (req, res) => {
		try {
			const image = req.file.filename;
			const { position, company_name, date_before, date_after, description } = req.body

			const upload = await uploadPhotoCloudinary(req.file.path)

			const idJobseeker = req.payload.id
			const id = uuidv4();

			const data = {
				id,
				position,
				company_name,
				date_before,
				date_after,
				description,
				jobseekerId: idJobseeker,
				image: upload.secure_url,
			}

			experiencesModel.createExperience(data).then(result => {
				helperResponse.response(res, result.rows, 201, "Created experiences Success!");
			}).catch(error => {
				res.status(500).send(error)
			})

		} catch (error) {
			console.log(error);
		}
	},

	updateExperience: async (req, res) => {
		const image = req.file.filename;
		const PORT = process.env.PORT || 5000;
		const HOST = process.env.PGHOST || 'localhost';

		const id = req.params.id;
		const { position, company_name, date_before, date_after, description } = req.body

		const result = await experiencesModel.getDetailExperience(id);
		if (!result.rowCount) return res.json({ message: 'Data Experience Not Found!' });

		const { rows: [cekId] } = result
		const idJobseeker = req.payload.id
		if (idJobseeker !== cekId.jobseekerid) return res.json({ message: 'Sorry, this is not your experiences!' });

		const data = {
			id, position, company_name, date_before, date_after, description, jobseekerId: idJobseeker,
			image: `http://${HOST}:${PORT}/img/${image}`,
		};

		experiencesModel.updateExperience(data).then((result) => {
			helperResponse.response(res, result.rows, 201, `Data Experience ${id} Updated!`);
		}).catch((error) => {
			res.send(error);
		});
	},

	deleteExperiences: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await experiencesModel.findId(id);
		if (!rowCount) return res.json({ message: `Data Experiences id: ${id} Not Found!` })

		// cek id jobseeker
		const { rows: [cekId] } = await experiencesModel.getDetailExperience(id)
		const idJobseeker = req.payload.id
		if (idJobseeker !== cekId.jobseekerid) return res.json({ message: 'Sorry, this is not your experiences!' });

		experiencesModel.deleteExperiences(id).then(result => {
			helperResponse.response(res, result.rows, 200, "Data Experience Deleted!")
		}).catch(error => {
			res.send(error)
		})
	},
}

module.exports = experiencesController;