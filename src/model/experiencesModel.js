const Pool = require('../config/db');


const getAllExperience = (searchParams, sortBy, sort, limit, offset) => {
    return Pool.query(`SELECT * FROM experiences WHERE company_name LIKE '%${searchParams}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const getDetailExperience = (id) => {
    return Pool.query(`SELECT * FROM experiences WHERE id='${id}'`)
}


const createExperience = (data) => {
    const { id, position, company_name, date_before, date_after, description, jobseekerId, image } = data

    return Pool.query(`INSERT INTO experiences(id, position, company_name, date_before, date_after, description, jobseekerId, image)
    VALUES ('${id}','${position}', '${company_name}', '${date_before}', '${date_after}', '${description}', '${jobseekerId}', '${image}')`);
}

const updateExperience = (data) => {
    const { id, position, company_name, date_before, date_after, description, jobseekerId, image } = data;

    return Pool.query(`UPDATE experiences SET position='${position}', company_name='${company_name}', date_before='${date_before}',date_after='${date_after}', description='${description}', jobseekerid='${jobseekerId}',  image='${image}' WHERE id='${id}';`)
}

const deleteExperiences = (id) => {
    return Pool.query(`DELETE FROM experiences WHERE id='${id}'`)
}

const findId = (id) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT id FROM experiences WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

const countData = () => {
    return Pool.query(`SELECT COUNT(*) FROM experiences`);
}

const findIdJobseeker = (idJobseeker) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT * FROM experiences WHERE jobseekerid='${idJobseeker}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};


const getDetailExperienceJobseeker = (id) => {
    return Pool.query(`SELECT * FROM experiences WHERE jobseekerid='${id}'`)
}

module.exports = {
    getAllExperience,
    getDetailExperience,
    createExperience,
    updateExperience,
    deleteExperiences,
    findIdJobseeker,
    findId,
    countData,
    getDetailExperienceJobseeker
}