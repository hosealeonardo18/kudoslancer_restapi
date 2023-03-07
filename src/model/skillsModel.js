const Pool = require('../config/db');


const getAllSkill = (searchParams, sortBy, sort, limit, offset) => {
    return Pool.query(`SELECT * FROM skills WHERE skill_name LIKE '%${searchParams}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`)
}

const getDetailSkill = (id) => {

    return Pool.query(`SELECT * FROM skills WHERE id='${id}'`)
}

const createSkill = async (data) => {
    const { id, skill_name } = data

    return await Pool.query(`INSERT INTO skills(id, skill_name)
    VALUES ('${id}','${skill_name}')`);
}

const updateSkill = (data) => {
    const { id, skill_name } = data;
    return Pool.query(`UPDATE skills SET skill_name='${skill_name}' WHERE id='${id}';`)
}

const deleteSkill = (id) => {
    return Pool.query(`DELETE FROM skills WHERE id='${id}'`)
}

const findId = (id) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT id FROM skills WHERE id='${id}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

const countData = () => {
    return Pool.query(`SELECT COUNT(*) FROM skills`);
}

const findSkillName = (skillName) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT * FROM skills WHERE skill_name='${skillName}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

// Skill by Jobseeker
const createJobseekerSkill = (data) => {
    console.log(data);
    const { id, skillId, jobseekerId } = data

    return Pool.query(`INSERT INTO jobseeker_skills(id, skillid, jobseekerid) VALUES ('${id}','${skillId}', '${jobseekerId}')`);

};

const getDetailSkillJobseeker = (id) => {
    return Pool.query(`SELECT jobseeker_skills.*, jobseekers.fullname AS jobseeker_fullname, skills.skill_name AS skill_name  
    FROM jobseeker_skills 
    INNER JOIN jobseekers ON jobseekers.id = jobseeker_skills.jobseekerid
    INNER JOIN skills ON skills.id = jobseeker_skills.skillId WHERE jobseekerid='${id}'`)
    // return Pool.query(`SELECT * FROM jobseeker_skills WHERE jobseekerid='${id}'`)
}

const getAllSkillJobseeker = () => {
    return Pool.query(`SELECT jobseeker_skills.*, jobseekers.fullname AS jobseeker_fullname, skills.skill_name AS skill_name  
    FROM jobseeker_skills 
    INNER JOIN jobseekers ON jobseekers.id = jobseeker_skills.jobseekerid
    INNER JOIN skills ON skills.id = jobseeker_skills.skillId`)
    // return Pool.query(`SELECT * FROM jobseeker_skills WHERE jobseekerid='${id}'`)
}

// const getAlljobseekerSkill = (searchParams, sortBy, sort, limit, offset) => {
//     return Pool.query(`SELECT * FROM jobseeker_skills WHERE skill_name LIKE '%${searchParams}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`)
// }

module.exports = {
    getAllSkill,
    getDetailSkill,
    createSkill,
    updateSkill,
    deleteSkill,
    findSkillName,
    findId,
    countData,
    createJobseekerSkill,
    getDetailSkillJobseeker,
    getAllSkillJobseeker
}