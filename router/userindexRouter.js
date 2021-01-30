const express = require('express');
const router = express();
const controller = require('../controller/userindex');
const indexMiddleware = require('../middlewares/indexMiddleware');

// GETS
router.get('/', controller.getLogin);
router.post('/', controller.postLogin);
router.post('/logout', controller.postLogout);
//
/*
    ADMIN
*/
router.get('/a/doc/editSA', controller.getAdocEditSA);
router.get('/a/doc/editSD', controller.getAdocEditSD);
router.get('/a/doc/newSA', controller.getAdocNewSA);
router.get('/a/doc/newSD', controller.getAdocNewSD);
router.get('/a/doc/SA', controller.getAdocSA);
router.get('/a/doc/SD', controller.getAdocSD);
router.get('/a/fees/add', controller.getAfeeAdd);
router.get('/a/fees/editUE', controller.getAfeeEditUE);
router.get('/a/fees/misc', controller.getAfeeMisc);
router.get('/a/fees/other', controller.getAfeeOthers);
router.get('/a/fees/tuition', controller.getAfeeTuition);
router.get('/a/fees/uponE', controller.getAfeeUponE);
router.get('/a/sched/CurSchoolYr', controller.getAschedCurSchoolYr);
router.get('/a/sched/ClassSched', controller.getAschedClassSched);
router.get('/a/sched/newClassSched', controller.getAschednewClassSched);
router.get('/a/sched/AcadCalendar', controller.getAschedAcadCalendar);
router.get('/a/sched/newAcadCalendar', controller.getAschednewAcadCalendar);
router.get('/a/sched/editAcadCalendar', controller.getAschededitAcadCalendar);
router.get('/a/users/SProfile/:userID', controller.getAuserSProf);
router.get('/a/users/SEmail', controller.getAuserSEmail);
router.get('/a/users/SAccount', controller.getAuserSAcc);
router.get('/a/users/PProfile', controller.getAuserPProf);
router.get('/a/users/parents', controller.getAuserParent);
router.get('/a/users/PAccount', controller.getAuserPAcc);
router.get('/a/users/AProfile', controller.getAuserAProf);
router.get('/a/users/admins', controller.getAuserAdmin);
router.get('/a/users/students', controller.getAuserStudents);
router.get('/a/users/teachers', controller.getAuserTeachers);
router.get('/a/users/TProfile', controller.getAuserTProf);
router.get('/a/users/editTeachers', controller.getAusereditTeachers);

/*
    TEACHER
*/
router.get('/t/sched/acadCalendar', controller.getTschedacadCalendar);
router.get('/t/sched/acadCalendar2', controller.getTschedacadCalendar2);
router.get('/t/sched/classSched', controller.getTschedclassSched);
router.get('/t/users/SGrades', controller.getTuserSgrades);
router.get('/t/users/SProfile', controller.getTuserSProf);
router.get('/t/users/students', controller.getTuserStudents);

/*
    PARENT
*/
router.get('/p/acc/EnrollChild', controller.getPaccEChild);
router.get('/p/acc/studentGrades', controller.getPaccSGrades);
router.get('/p/acc/NewChild', controller.getPaccNewChild);
router.get('/p/pay/bank', controller.getPpaybank);
router.get('/p/pay/bankPaymentPlan', controller.getPpayBankPlan);
router.get('/p/pay/cc', controller.getPpaycc);
router.get('/p/pay/ccOTP', controller.getPpayCCOTP);
router.get('/p/pay/ccPaymentPlan', controller.getPpayCCPlan);
router.get('/p/sched/acadCalendar', controller.getPschedacadCalendar);
router.get('/p/sched/acadCalendar2', controller.getPschedacadCalendar2);
router.get('/p/sched/classSched', controller.getPschedclassSched);
router.get('/p/trans/brkdwn', controller.getPtransBD);
router.get('/p/trans/stmacc', controller.getPtransSA);


/*
    STUDENT
*/
router.get('/enroll', controller.getEnrollmentNew);
router.get('/enroll/parent', controller.getEnrollmentParent);
router.get('/s/acc/grades', controller.getSaccgrades);
router.get('/s/acc/updateInfo', controller.getEnrollemtOld);
router.get('/s/sched/acadCalendar', controller.getSschedacadCalendar);
router.get('/s/sched/acadCalendar2', controller.getSschedacadCalendar2);
router.get('/s/sched/classSched', controller.getSschedclassSched);
router.get('/s/trans/brkdwn', controller.getStransBD);
router.get('/s/trans/stmacc', controller.getStransSA);

router.post('/enroll', controller.postEnrollmentNew);
router.post('/enroll/parent/old',indexMiddleware.validateEnrollOldParent, controller.postEnrollParentOld);


module.exports = router;











































// //ADMIN

// //ADMINS USERS
// router.get('/a/users/admins', controller.getAadmins);
// router.get('/a/users/adminsProfile', controller.getAadminsProfile);
// router.get('/a/users/teachers', controller.getAteachers);
// router.get('/a/users/teachersProfile', controller.getAteachersProfile);
// router.get('/a/users/editTeachers', controller.getAeditTeachers);
// router.get('/a/users/students', controller.getAstudents);
// router.get('/a/users/studentsProfile', controller.getAstudentsProfile);
// router.get('/a/users/studentsAccount', controller.getAstudentsAccount);
// router.get('/a/users/studentsEmail', controller.getAstudentsEmail);
// router.get('/a/users/parents', controller.getAparents);
// router.get('/a/users/parentsProfile', controller.getAparentsProfile);
// router.get('/a/users/parentsAccount', controller.getAparentsAccount);
// //ADMIN FEES
// router.get('/a/fees/tuition', controller.getAtuition);
// router.get('/a/fees/miscellaneous', controller.getAmiscellaneous);
// router.get('/a/fees/other', controller.getAother);
// router.get('/a/fees/additional', controller.getAadditional)
// router.get('/a/fees/uponEnrollment', controller.getAuponEnrollment);
// router.get('/a/fees/editUponEnrollment', controller.getAeditUponEnrollment);
// //ADMIN DOCUMENTS
// router.get('/a/docs/studentDocs', controller.getAstudentDocs);
// router.get('/a/docs/newStudentDocs', controller.getAnewStudentDocs);
// router.get('/a/docs/editStudentDocs', controller.getAeditStudentDocs);
// router.get('/a/docs/studentAgree', controller.getAstudentAgree);
// router.get('/a/docs/newStudentAgree', controller.getAnewStudentAgree);
// router.get('/a/docs/editStudentAgree', controller.getAeditStudentAgree);
// //ADMIN SCGEDULE
// router.get('/a/sched/schoolYr', controller.getAschoolYr);
// router.get('/a/sched/calendar', controller.getAcalendar);
// router.get('/a/sched/newEvent', controller.getAnewEvent);
// router.get('/a/sched/editEvent', controller.getAeditEvent);
// router.get('/a/sched/classSched', controller.getAclassSched);
// router.get('/a/sched/newClassSched', controller.getAnewClassSched);

// //TEACHER

// //TEACHER USERS
// router.get('/t/users/students', controller.getTstudents);
// router.get('/t/users/studentsProfile', controller.getTstudentsProfile);
// router.get('/t/users/grades', controller.getTgrades);
// //TEACHER SCHEDULE
// router.get('/t/sched/classSched', controller.getTclassSched);
// router.get('/t/sched/calendarQuery', controller.getTcalendarQuery);
// router.get('/t/sched/calendarResults', controller.getTcalendarResults);

// //PARENT

// //PARENT PAYMENT
// router.get('/p/pay/ccQuery', controller.getPccQuery);
// router.get('/p/pay/ccInfo', controller.getPccInfo);
// router.get('/p/pay/ccOTP', controller.getPccOTP);
// router.get('/p/pay/bankQuery', controller.getPbankQuery);
// router.get('/p/pay/bankUpload', controller.getPbankUpload);
// //PARENT TRANSACTIONS
// router.get('/p/trans/account', controller.getPaccount);
// router.get('/p/trans/breakdown', controller.getPbreakdown);
