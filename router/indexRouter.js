const express = require('express');
const router = express();
const controller = require('../controller/index');
const indexMiddleware = require('../middlewares/indexMiddleware');

// GETS
router.get('/', controller.getLogin);

//ADMINS USERS
router.get('/a/admins', controller.getAadmins);
router.get('/a/teachers', controller.getAteachers);
router.get('/a/students', controller.getAstudents);
router.get('/a/students', controller.getAstudents);
router.get('/a/parents', controller.getAparents);
//ADMIN FEES
router.get('/a/');