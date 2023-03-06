const Pool = require('../config/db');


const getAllJobseeker = (searchParams, sortBy, sort, limit, offset) => {
    return Pool.query(`SELECT * FROM jobseekers WHERE fullname LIKE '%${searchParams}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const getDetailJobseeker = (id) => {
    return Pool.query(`SELECT * FROM jobseekers WHERE id='${id}'`)
}

const updateJobseekers = (data) => {
    const {
        id, fullname, email, password, no_telp, city, position, company_name, description, instagram, github, image
    } = data;

    return Pool.query(`UPDATE jobseekers SET fullname='${fullname}', email='${email}', password='${password}',no_telp='${no_telp}', city='${city}', position='${position}',  company_name='${company_name}', description='${description}', image='${image}', instagram='${instagram}', github='${github}' WHERE id='${id}';`)
}

const deleteJobseekers = (id) => {
    return Pool.query(`DELETE FROM jobseekers WHERE id='${id}'`)
}

const findId = (id) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT id FROM jobseekers WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

const countData = () => {
    return Pool.query(`SELECT COUNT(*) FROM jobseekers`);
}

// auth
const registerJobseekers = (data) => {
    const { id, fullname, password, email, no_telp, role } = data


    return Pool.query(`INSERT INTO jobseekers(id, fullname, email, password, no_telp, city, position, company_name, description, image, instagram, github, role)
    VALUES ('${id}','${fullname}', '${email}', '${password}', ${no_telp}, '', '', '', '', '', '', '', '${role}')`);
}

const findEmail = (email) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT * FROM jobseekers WHERE email='${email}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};


module.exports = {
    getAllJobseeker,
    getDetailJobseeker,
    registerJobseekers,
    updateJobseekers,
    deleteJobseekers,
    findEmail,
    findId,
    countData
}