CREATE DATABASE kudoslancer;

CREATE TABLE jobseekers (
  id VARCHAR(255) PRIMARY KEY NOT NULL , 
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL ,
  password VARCHAR(255) NOT NULL,
  no_telp VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  position VARCHAR(255) NULL ,
  company_name VARCHAR(255) NULL,
  description text NULL,
  image VARCHAR(255) NULL,
  instagram VARCHAR(255) NULL,
  github VARCHAR(255) NULL,
  role VARCHAR(255) NULL
);

ALTER TABLE jobseekers ALTER COLUMN no_telp VARCHAR(255);

CREATE TABLE skills (
  id VARCHAR(255) PRIMARY KEY NOT NULL ,
  skill_name VARCHAR(255) NOT NULL
);

CREATE TABLE jobseeker_skills (
  id VARCHAR(255) PRIMARY KEY NOT NULL ,
  skillId VARCHAR(255),
  jobseekerId VARCHAR(255),

  CONSTRAINT fk_skill
  FOREIGN KEY (skillId) 
  REFERENCES skills(id) ON DELETE CASCADE,

  CONSTRAINT fk_jobseeker
  FOREIGN KEY (jobseekerId) 
  REFERENCES jobseekers(id) ON DELETE CASCADE
);

CREATE TABLE categories (
  id VARCHAR(255) PRIMARY KEY NOT NULL ,
  category_name VARCHAR(255)
);

-- CREATE TABLE worker_categories (
--   id VARCHAR(255) PRIMARY KEY NOT NULL ,
--   categories_id VARCHAR(255),
--   worker_id VARCHAR(255),

--   CONSTRAINT fk_worker
--   FOREIGN KEY (worker_id) 
--   REFERENCES workers(id) ON DELETE CASCADE,

--   CONSTRAINT fk_categories
--   FOREIGN KEY (categories_id) 
--   REFERENCES categories(id) ON DELETE CASCADE
-- );

CREATE TABLE portfolios (
  id VARCHAR(255) PRIMARY KEY NOT NULL ,
  application_name VARCHAR(255) NULL,
  link_repository VARCHAR(255) NULL,
  type_portfolio VARCHAR(255) NULL,
  image VARCHAR(255) NULL ,
  jobseekerId VARCHAR(255) NOT NULL,

  CONSTRAINT fk_jobseeker
  FOREIGN KEY (jobseekerId) 
  REFERENCES jobseekers(id) ON DELETE CASCADE
);

CREATE TABLE experiences (
  id VARCHAR(255) PRIMARY KEY NOT NULL ,
  posisition VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  date_before DATE NULL,
  date_after DATE NULL,
  description text NULL,
  jobseekerId VARCHAR(255),
  image VARCHAR(255) NULL,

  CONSTRAINT fk_jobseeker
  FOREIGN KEY (jobseekerId) 
  REFERENCES jobseekers(id) ON DELETE CASCADE
);

CREATE TABLE recruiters (
  id VARCHAR(255) PRIMARY KEY NOT NULL , 
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL ,
  password VARCHAR(255) NOT NULL,
  no_telp INT NULL,
  company_name VARCHAR(255) NULL, 
  company_field VARCHAR(255) NULL,
  city VARCHAR(255) NULL,
  description text NULL,
  instagram VARCHAR(255) NULL,
  linkedin VARCHAR(255) NULL,
  image VARCHAR(255) NULL,
  image_thumbnail VARCHAR(255) NULL
);

CREATE TABLE testimonials (
  id VARCHAR(255) PRIMARY KEY NOT NULL ,
  message text NOT NULL,
  jobseekerId VARCHAR(255),

  CONSTRAINT fk_jobseeker
  FOREIGN KEY (jobseekerId) 
  REFERENCES jobseekers(id) ON DELETE CASCADE
);



