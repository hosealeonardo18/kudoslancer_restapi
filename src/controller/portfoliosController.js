const portfoliosModel = require('../model/portfoliosModel')
const helperResponse = require('../helper/common');
const { v4: uuidv4 } = require('uuid');
const { uploadPhotoCloudinary } = require('../../cloudinary')


const portfoliosController = {
	getAllPortfolio: async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 5;
			const offset = (page - 1) * limit;
			let searchParams = req.query.search || "";
			let sortBy = req.query.sortBy || "application_name";
			let sort = req.query.sort || "ASC";

			const result = await portfoliosModel.getAllPortfolio(searchParams, sortBy, sort, limit, offset)
			const { rowCount } = result;

			if (!rowCount) return res.json({ message: "Data Not Found!" })

			const { rows: [count] } = await portfoliosModel.countData();

			const totalData = parseInt(count.count);
			const totalPage = Math.ceil(totalData / limit);
			const pagination = {
				currentPage: page,
				limit: limit,
				totalData: totalData,
				totalPage: totalPage
			}

			helperResponse.response(res, result.rows, 200, "Get Data Portfolio Success!", pagination);
		} catch (error) {
			console.log(error);
		}
	},

	getDetailPortfolio: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await portfoliosModel.getDetailPortfolio(id);

		if (!rowCount) return res.json({ message: 'Data Portfolio Not Found!' });

		portfoliosModel.getDetailPortfolio(id).then(result => {
			helperResponse.response(res, result.rows, 200, 'Get Data Success!');
		}).catch(error => {
			res.send(error);
		})
	},

	createPortfolio: async (req, res) => {
		try {
			const image = req.file.filename;
			const { application_name, link_repository, type_portfolio } = req.body


			const upload = await uploadPhotoCloudinary(req.file.path)

			const idJobseeker = req.payload.id
			const id = uuidv4();

			const data = { id, application_name, link_repository, type_portfolio, image: upload.secure_url, jobseekerId: idJobseeker }

			portfoliosModel.createPortfolio(data).then(result => {
				helperResponse.response(res, result.rows, 201, "Portfolio Created!");
			}).catch(error => {
				res.status(500).send(error)
			})

		} catch (error) {
			console.log(error);
		}
	},

	updatePortfolio: async (req, res) => {
		const image = req.file.filename;
		const PORT = process.env.PORT || 5000;
		const HOST = process.env.PGHOST || 'localhost';

		const id = req.params.id;
		const { application_name, link_repository, type_portfolio } = req.body

		const result = await portfoliosModel.getDetailPortfolio(id);
		if (!result.rowCount) return res.json({ message: 'Data Portfolio Not Found!' });

		const { rows: [cekId] } = result
		const idJobseeker = req.payload.id
		if (idJobseeker !== cekId.jobseekerid) return res.json({ message: 'Sorry, this is not your experiences!' });

		const data = {
			id, application_name, link_repository, type_portfolio, image: `http://${HOST}:${PORT}/img/${image}`, jobseekerId: idJobseeker
		};

		portfoliosModel.updatePortfolio(data).then((result) => {
			helperResponse.response(res, result.rows, 201, `Data Portfolio ${id} Updated!`);
		}).catch((error) => {
			console.log(error);
			res.send(error);
		});
	},

	deletePortfolio: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await portfoliosModel.findId(id);

		if (!rowCount) return res.json({ message: `Data Experiences id: ${id} Not Found!` })

		// cek id jobseeker
		const { rows: [cekId] } = await portfoliosModel.getDetailPortfolio(id)
		const idJobseeker = req.payload.id
		if (idJobseeker !== cekId.jobseekerid) return res.json({ message: 'Sorry, this is not your experiences!' });

		portfoliosModel.deletePortfolio(id).then(result => {
			helperResponse.response(res, result.rows, 200, "Data Portfolio Deleted!")
		}).catch(error => {
			res.send(error)
		})
	},

	getDetailPortfolioJobseeker: async (req, res) => {
		const id = req.params.id

		portfoliosModel.getDetailPortfolioJobseeker(id).then(result => {
			helperResponse.response(res, result.rows, 200, 'Get Data Success!');
		}).catch(error => {
			res.send(error);
		})
	}
}

module.exports = portfoliosController;