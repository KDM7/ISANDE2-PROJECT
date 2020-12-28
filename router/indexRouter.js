const express = require('express');
const router = express();
const controller = require('../controller/index');
const indexMiddleware = require('../middlewares/indexMiddleware');

// GETS
router.get('/', controller.getLogin);

//ADMIN

//ADMINS USERS
router.get('/a/users/admins', controller.getAadmins);
router.get('/a/users/adminsProfile', controller.getAadminsProfile);
router.get('/a/users/teachers', controller.getAteachers);
router.get('/a/users/teachersProfile', controller.getAteachersProfile);
router.get('/a/users/editTeachers', controller.getAeditTeachers);
router.get('/a/users/students', controller.getAstudents);
router.get('/a/users/studentsProfile', controller.getAstudentsProfile);
router.get('/a/users/studentsAccount', controller.getAstudentsAccount);
router.get('/a/users/studentsEmail', controller.getAstudentsEmail);
router.get('/a/users/parents', controller.getAparents);
router.get('/a/users/parentsProfile', controller.getAparentsProfile);
router.get('/a/users/parentsAccount', controller.getAparentsAccount);
//ADMIN FEES
router.get('/a/fees/tuition', controller.getAtuition);
router.get('/a/fees/miscellaneous', controller.getAmiscellaneous);
router.get('/a/fees/other', controller.getAother);
router.get('/a/fees/additional', controller.getAadditional)
router.get('/a/fees/uponEnrollment', controller.getAuponEnrollment);
router.get('/a/fees/editUponEnrollment', controller.getAeditUponEnrollment);
//ADMIN DOCUMENTS
router.get('/a/docs/studentDocs', controller.getAstudentDocs);
router.get('/a/docs/newStudentDocs', controller.getAnewStudentDocs);
router.get('/a/docs/editStudentDocs', controller.getAeditStudentDocs);
router.get('/a/docs/studentAgree', controller.getAstudentAgree);
router.get('/a/docs/newStudentAgree', controller.getAnewStudentAgree);
router.get('/a/docs/editStudentAgree', controller.getAeditStudentAgree);
//ADMIN SCGEDULE
router.get('/a/sched/schoolYr', controller.getAschoolYr);
router.get('/a/sched/calendar', controller.getAcalendar);
router.get('/a/sched/newEvent', controller.getAnewEvent);
router.get('/a/sched/editEvent', controller.getAeditEvent);
router.get('/a/sched/classSched', controller.getAclassSched);
router.get('/a/sched/newClassSched', controller.getAnewClassSched);

//TEACHER

//TEACHER USERS
router.get('/t/users/students', controller.getTstudents);
router.get('/t/users/studentsProfile', controller.getTstudentsProfile);
router.get('/t/users/grades', controller.getTgrades);
//TEACHER SCHEDULE
router.get()