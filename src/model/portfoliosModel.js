const Pool = require('../config/db');

const getAllPortfolio = (searchParams, sortBy, sort, limit, offset) => {
    return Pool.query(`SELECT * FROM portfolios WHERE application_name LIKE '%${searchParams}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const getDetailPortfolio = (id) => {
    return Pool.query(`SELECT * FROM portfolios WHERE id='${id}'`)
}

const createPortfolio = (data) => {
    const { id, application_name, link_repository, type_portfolio, image, jobseekerId } = data

    return Pool.query(`INSERT INTO portfolios(id, application_name, link_repository, type_portfolio, image, jobseekerid )
    VALUES ('${id}','${application_name}', '${link_repository}', '${type_portfolio}', '${image}', '${jobseekerId}')`);
}

const updatePortfolio = (data) => {
    console.log(data);
    const { id, application_name, link_repository, type_portfolio, image, jobseekerId } = data;

    return Pool.query(`UPDATE portfolios SET application_name='${application_name}', link_repository='${link_repository}', type_portfolio='${type_portfolio}',image='${image}', jobseekerid='${jobseekerId}' WHERE id='${id}';`)
}

const deletePortfolio = (id) => {
    return Pool.query(`DELETE FROM portfolios WHERE id='${id}'`)
}

const findId = (id) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT id FROM portfolios WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

const countData = () => {
    return Pool.query(`SELECT COUNT(*) FROM portfolios`);
}

const getDetailPortfolioJobseeker = (id) => {
    return Pool.query(`SELECT * FROM portfolios WHERE jobseekerid='${id}'`)
}




module.exports = {
    getAllPortfolio,
    getDetailPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    findId,
    countData,
    getDetailPortfolioJobseeker
}