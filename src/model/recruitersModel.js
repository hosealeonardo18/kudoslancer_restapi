const Pool = require('../config/db');

const getAllRecruiter = (searchParams, sortBy, sort, limit, offset) => {
    return Pool.query(`SELECT * FROM recruiters WHERE fullname LIKE '%${searchParams}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const getDetailRecruiter = (id) => {
    return Pool.query(`SELECT * FROM recruiters WHERE id='${id}'`)
}

const updateRecruiter = (data) => {
    const {
        id, fullname, email, no_telp, company_name, company_field, city, description, instagram, linkedin, image, role
    } = data;

    return Pool.query(`UPDATE recruiters SET fullname='${fullname}', email='${email}', no_telp='${no_telp}', company_name='${company_name}', company_field='${company_field}', city='${city}',   description='${description}',instagram='${instagram}', linkedin='${linkedin}',image='${image}', image_thumbnail='', role='${role}'  WHERE id='${id}';`)
}

const deleteRecruiter = (id) => {
    return Pool.query(`DELETE FROM recruiters WHERE id='${id}'`)
}

const findId = (id) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT id FROM recruiters WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

const countData = () => {
    return Pool.query(`SELECT COUNT(*) FROM recruiters`);
}

// auth
const registerRecruiters = (data) => {
    const { id, fullname, email, company_name, company_field, no_telp, password, role, image } = data

    return Pool.query(`INSERT INTO recruiters(id, fullname, email, password, no_telp, company_name, company_field, city, description, instagram, linkedin, image, image_thumbnail, role)
    VALUES ('${id}','${fullname}', '${email}', '${password}', ${no_telp}, '${company_name}', '${company_field}', '', '', '', '', '${image}', '', '${role}')`);
}

const findEmail = (email) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT * FROM recruiters WHERE email='${email}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};


module.exports = {
    getAllRecruiter,
    getDetailRecruiter,
    registerRecruiters,
    updateRecruiter,
    deleteRecruiter,
    findEmail,
    findId,
    countData
}