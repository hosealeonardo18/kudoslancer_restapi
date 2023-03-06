const skillsModel = require('../model/skillsModel')
const helperResponse = require('../helper/common');
const { v4: uuidv4 } = require('uuid');

const skillsController = {
	getAllSkill: async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 5;
			const offset = (page - 1) * limit;
			let searchParams = req.query.search || "";
			let sortBy = req.query.sortBy || "skill_name";
			let sort = req.query.sort || "ASC";

			const result = await skillsModel.getAllSkill(searchParams, sortBy, sort, limit, offset)
			const { rows: [count] } = await skillsModel.countData();

			const totalData = parseInt(count.count);
			const totalPage = Math.ceil(totalData / limit);
			const pagination = {
				currentPage: page,
				limit: limit,
				totalData: totalData,
				totalPage: totalPage
			}

			helperResponse.response(res, result.rows, 200, "Get Data Skills Success!", pagination);
		} catch (error) {
			console.log(error);
		}
	},

	getDetailSkill: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await skillsModel.getDetailSkill(id);

		if (!rowCount) return res.json({ message: `Data Skill ${id} Not Found!` });

		skillsModel.getDetailSkill(id).then(result => {
			helperResponse.response(res, result.rows, 200, 'Get Data Success!');
		}).catch(error => {
			res.send(error);
		})
	},

	createSkill: async (req, res) => {
		try {
			const {
				skill_name
			} = req.body

			const { rowCount } = await skillsModel.findSkillName(skill_name);
			if (rowCount) return res.json({ message: "Skills are now available" })

			const id = uuidv4();
			const data = {
				id,
				skill_name
			}

			skillsModel.createSkill(data).then(result => {
				helperResponse.response(res, result.rows, 201, "Create Skill Success!");
			}).catch(error => {
				res.status(500).send(error)
			})

		} catch (error) {
			console.log(error);
		}
	},

	updateSkill: async (req, res) => {
		const id = req.params.id;
		const { skill_name } = req.body

		const { rowCount } = await skillsModel.getDetailSkill(id);
		if (!rowCount) return res.json({ message: 'Data Skill Not Found!' });

		const data = {
			id,
			skill_name
		};

		skillsModel
			.updateSkill(data)
			.then((result) => {
				helperResponse.response(res, result.rows, 201, `Data Skill ${id} Updated!`);
			})
			.catch((error) => {
				res.send(error);
			});
	},

	deleteSkill: async (req, res) => {
		const id = req.params.id;
		const { rowCount } = await skillsModel.findId(id);

		if (!rowCount) return res.json({ message: `Data Skill id: ${id} Not Found!` })

		skillsModel.deleteSkill(id).then(result => {
			helperResponse.response(res, result.rows, 200, `Data Skill id: ${id} Deleted!`)
		}).catch(error => {
			res.send(error)
		})
	},

	createJobseekerSkill: async (req, res) => {
		try {
			const { skill_name } = req.body
			const { rows: [skillName] } = await skillsModel.findSkillName(skill_name)
			const id = uuidv4();

			const { rows: [idSkill] } = await skillsModel.findSkillName(skill_name)

			if (!skillName) {
				const data = { id, skill_name }
				const jobseekerId = req.payload

				const idSkillJobseeker = uuidv4();

				skillsModel.createSkill(data).then(async (result) => {
					console.log(result);
					if (result.rowCount !== 0) {
						const data = {
							id: idSkillJobseeker,
							skillId: id,
							jobseekerId: jobseekerId.id
						}

						return skillsModel.createJobseekerSkill(data).then(result => { return helperResponse.response(res, result.rows, 201, "Create Jobseeker Skill Successfull!"); })
					} else {
						return helperResponse.response(res, result.rows, 201, "Create Skill Success!");
					}

				}).catch(error => {
					console.log(error);
					res.status(500).send(error)
				})
			} else {
				const jobseekerId = req.payload
				const { rows: [skill] } = await skillsModel.findSkillName(skill_name)

				data = {
					id,
					skillId: skill.id,
					jobseekerId: jobseekerId.id
				}

				skillsModel.createJobseekerSkill(data).then(result => { helperResponse.response(res, result.rows, 201, "Create Jobseeker Skill Successfull!"); })
			}

		} catch (error) {
			console.log(error);
		}
	},

	detailJobseekerSkill: async (req, res) => {
		const idJobseeker = req.payload.id

		const result = await skillsModel.getDetailSkillJobseeker(idJobseeker)
		const { rowCount } = result
		if (!rowCount) return res.json({ message: 'This id has no data' })

		const { rows } = result

		skillsModel.getDetailSkillJobseeker(idJobseeker).then(result => {
			helperResponse.response(res, result.rows, 200, 'Get Data Success!');
		}).catch(error => {
			res.send(error);
		})
	}
}

module.exports = skillsController;