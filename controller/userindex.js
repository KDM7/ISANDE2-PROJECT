// 

const fs = require('fs');
const handlebars = require('handlebars');

// 

const userModel = require("../model/usersdb");
const adminModel = require("../model/admindb");
const teacherModel = require("../model/teacherdb");
const parentModel = require("../model/parentsdb");
const studentModel = require("../model/studentdb");
const sectionModel = require("../model/sectiondb");
const schoolYearModel = require("../model/schoolYeardb");
const studentDetailsModel = require("../model/studentDetailsdb");
const ref_sectionModel = require("../model/ref_sectiondb");
const studentMembersModel = require("../model/sectionMembersdb")

const bcrypt = require('bcrypt');
const e = require('express');
const saltRounds = 10;

/*
    CONSTRUCTORS
*/
function User(userID, password, firstName, lastName, middleName, type, gender) {
    this.userID = userID;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.type = type;
    this.gender = gender;
}

function Admin(userID, dateCreated) {
    this.userID = userID;
    this.dateCreated = dateCreated;
}

function Teacher(userID, dateCreated) {
    this.userID = userID;
    this.dateCreated = dateCreated;
}

function Parent(userID, mobileNum, nationality, birthDate, birthPlace) {
    this.userID = userID;
    this.mobileNum = mobileNum;
    this.nationality = nationality;
    this.birthDate = new Date(birthDate);
    this.birthPlace = birthPlace;
}

function Student(userID, parentID, mobileNum, teleNum, nationality, birthDate, birthPlace, email, religion, address) {
    this.userID = userID;
    this.parentID = parentID;
    this.mobileNum = mobileNum;
    this.teleNum = teleNum;
    this.nationality = nationality;
    this.birthDate = birthDate;
    this.birthPlace = birthPlace;
    this.email = email;
    this.religion = religion;
    this.address = address;
}

function Section(sectionID, sectionName, schoolYear, sectionAdviser) {
    this.sectionID = sectionID;
    this.sectionName = sectionName;
    this.schoolYear = schoolYear;
    this.sectionAdviser = sectionAdviser;
}

function schoolYear(schoolYear, isCurrent) {
    this.schoolYear = schoolYear;
    this.isCurrent = isCurrent;
}
//the following 4 constructors are for the student details function
function familyRecords(mName, mOccu, mEmail, mWorkAddress, mNum, fName, fOccu, fEmail, fWorkAddress, fNum, cName, relation, cEmail, cNum, cWorkAddress, fetchName, fetchNum) {
    this.mName = mName;
    this.mOccu = mOccu;
    this.mEmail = mEmail;
    this.mWorkAddress = mWorkAddress;
    this.mNum = mNum;
    this.fName = fName;
    this.fOccu = fOccu;
    this.fEmail = fEmail;
    this.fWorkAddress = fWorkAddress;
    this.fNum = fNum;
    this.cName = cName;
    this.relation = relation;
    this.cEmail = cEmail;
    this.cNum = cNum;
    this.cWorkAddress = cWorkAddress;
    this.fetchName = fetchName;
    this.fetchNum = fetchNum;
}

function siblings(name, age, occu) {
    this.name = name;
    this.age = age;
    this.occu = occu;
}

function eduBackground(name, acadYear) {
    this.name = name;
    this.acadYear = acadYear;
}

function studentDetails(studentID, reason) {
    this.studentID = studentID;
    this.reason = reason;
}

//functions
async function findUser(userID) {
    var user = await userModel.aggregate([{
        '$match': {
            'userID': userID
        }
    }, {
        '$project': {
            'userID': 1,
            'password': 1,
            'firstName': 1,
            'lastName': 1,
            'middleName': 1,
            'type': 1,
            'gender': 1
        }
    }]);
    return user[0];
}

//gets current schoolyear
async function getCurrentSY() {
    var schoolYear = await schoolYearModel.aggregate([{
        '$match': {
            'isCurrent': true
        }
    }, {
        '$project': {
            'schoolYear': 1
        }
    }])
    return schoolYear[0].schoolYear; //returns string
}

//gets a list of the current sections
async function getCurrentSections() {
    var current = await getCurrentSY();
    var sections = await sectionModel.aggregate([{
        '$match': {
            'schoolYear': current
        }
    }, {
        '$lookup': {
            'from': 'ref_section',
            'localField': 'sectionName',
            'foreignField': 'sectionName',
            'as': 'gradeLvl'
        }
    }, {
        '$unwind': {
            'path': '$gradeLvl',
            'preserveNullAndEmptyArrays': false
        }
    }, {
        '$project': {
            'sectionID': 1,
            'sectionName': 1,
            'sectionAdviser': 1,
            'gradeLvl': '$gradeLvl.gradeLvl'
        }
    }])
    return sections; //returns all sections in an array 
}

//get sections based on schoolYear and gradeLvl
async function getSectionsSYGL(schoolYear, gradeLvl) {
    var sectionIDs = await sectionModel.aggregate(
        [{ //merge section and ref_section for schoolYear and gradeLvl be in same doc
            '$lookup': {
                'from': 'ref_section',
                'localField': 'sectionName',
                'foreignField': 'sectionName',
                'as': 'section'
            }
        }, { //unwind section to be safe (this part doesnt seem to be important)
            '$unwind': {
                'path': '$section',
                'preserveNullAndEmptyArrays': true
            }
        }, { //get sections that are valid using the parameters
            '$match': {
                'schoolYear': schoolYear,
                'section.gradeLvl': gradeLvl
            }
        }, { //group sections into an array
            '$group': {
                '_id': null,
                'sectionID': {
                    '$push': '$sectionID'
                }
            }
        }, { //remove _id and project only the sectionID array which contains all valid section IDs based on parameters
            '$project': {
                '_id': false,
                'sectionID': true
            }
        }]
    );
    return sectionIDs[0].sectionID;
}

//get list of students based on an array of section IDs
async function getStudentsS(sectionIDs) {
    var students = await studentMembersModel.aggregate([{
        '$match': {
            'sectionID': {
                '$in': sectionIDs
            }
        }
    }, {
        '$group': {
            '_id': null,
            'students': {
                '$push': '$studentID'
            }
        }
    }, {
        '$project': {
            '_id': false,
            'students': true
        }
    }]);
    return students[0].students;
}

// get a list of students using 'schoolYear' an 'gradeLvl' as parameters
async function getStudentListSYGL(schoolYear, gradeLvl) {
    var sections = await getSectionsSYGL(schoolYear, gradeLvl);
    var students = await getStudentsS(sections);
    var studentList = await studentModel.aggregate(
        [{
            '$match': {
                'userID': {
                    '$in': students
                }
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'userID',
                'foreignField': 'userID',
                'as': 'userData'
            }
        }, {
            '$unwind': {
                'path': '$userData',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                'userID': 1,
                'firstname': '$userData.firstName',
                'middlename': '$userData.middleName',
                'lastname': '$userData.lastName'
            }
        }]
    );
    return studentList;
}

const indexFunctions = {
    /* 
        LOGIN FUNCTIONS    
    */

    // to show the login page
    getLogin: function (req, res) {
        res.render('login', {
            title: 'Login'
        });
    },

    //
    postLogin: async function (req, res) {
        var {
            user,
            pass
        } = req.body;
        try {
            var match = await findUser(user);
            console.log(user);
            console.log(pass);
            console.log(match);
            if (match) {
                console.log('matching');
                bcrypt.compare(pass, match.password, function (err, result) {
                    // var result = match.password == pass;
                    console.log('hi');
                    console.log(result);
                    if (result) {
                        if (match.type == 'A') {
                            //send 201 admin
                            req.session.logUser = match;
                            req.session.type = 'admin';
                            res.send({
                                status: 201
                            });
                        } else if (match.type == 'T') {
                            //send 202 teacher
                            req.session.logUser = match;
                            req.session.type = 'teacher';
                            res.send({
                                status: 202
                            });
                        } else if (match.type == 'P') {
                            //send 203 parent
                            req.session.logUser = match;
                            req.session.type = 'parent';
                            res.send({
                                status: 203
                            });
                        } else {
                            //send 204 student
                            req.session.logUser = match;
                            req.session.type = 'student';
                            res.send({
                                status: 204
                            });
                        }
                    } else res.send({
                        status: 401,
                        msg: 'Incorrect password.'
                    });
                });
            } else res.send({
                status: 401,
                msg: 'No user found.'
            });
        } catch (e) {
            console.log(e);
            res.send({
                status: 500,
                msg: e
            });
        }
    },

    /*      
        ADMIN FUNCTIONS
    */
    // to show the students from the admins side
    getAuserStudents: async function (req, res) {
        // after grades have been set up: may have to merge student and another var grades instead of trying to aggregate for remarks
        var schoolYear = await schoolYearModel.aggregate( //get school years in database for display in dropdown element
            [{
                '$project': {
                    'value': '$schoolYear',
                    'selected': '$isCurrent'
                }
            }]
        );

        var gradeLvl = await ref_sectionModel.aggregate(
            [{
                '$sort': {
                    'gradeLvl': 1
                }
            }, {
                '$project': {
                    'value': '$gradeLvl'
                }
            }]
        );

        var students = await getStudentListSYGL(schoolYear[0].value, gradeLvl[0].value);
        console.log(schoolYear[0].value);
        console.log(gradeLvl[0].value);
        // console.log('typeof sections:' + typeof sections);
        // console.log("students: ");
        // console.log(students);
        res.render('a_users_students', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Students',
            schoolYear: schoolYear,
            gradeLvl: gradeLvl,
            student: students

        });
    },

    // to show edit student agreements page for admins side
    getAdocEditSA: function (req, res) {
        res.render('a_doc_editSA', {
            title: 'Edit Student Agreement',
        });
    },

    // to show edit student documents page for admins side
    getAdocEditSD: function (req, res) {
        res.render('a_doc_editSD', {
            title: 'Edit Student Document',
        });
    },

    // to show new student agreements page for admin side
    getAdocNewSA: function (req, res) {
        res.render('a_doc_newSA', {
            title: 'New Student Agreement',
        });
    },

    // to show new student documents page for admin side
    getAdocNewSD: function (req, res) {
        res.render('a_doc_newSD', {
            title: 'New Student Document',
        });
    },

    // to show student agreements page for admin side
    getAdocSA: function (req, res) {
        res.render('a_doc_SA', {
            title: 'Student Agreement',
        });
    },

    // to show student documents page for admin side
    getAdocSD: function (req, res) {
        res.render('a_doc_SD', {
            title: 'Student Document',
        });
    },

    // to show Additional Fees page for admin side
    getAfeeAdd: function (req, res) {
        res.render('a_fee_add', {
            title: 'Additional Fees',
        });
    },

    // to show Edit Upon Enrollment page for admin side
    getAfeeEditUE: function (req, res) {
        res.render('a_fees_editUE', {
            title: 'Edit Upon Enrollment'
        });
    },

    // to show Miscellaneous Fees page for admin side
    getAfeeMisc: function (req, res) {
        res.render('a_fee_misc', {
            title: 'Miscellaneous Fees'
        });
    },

    // to show Other Fees page for admin side
    getAfeeOthers: function (req, res) {
        res.render('a_fees_others', {
            title: 'Other Fees'
        });
    },

    // to show Tuition Fees page for admin side
    getAfeeTuition: function (req, res) {
        res.render('a_fees_tuition', {
            title: 'Tuition Fees',
        });
    },

    // to show Upon Enrollment page for admin side
    getAfeeUponE: function (req, res) {
        res.render('a_fees_uponE', {
            title: 'Upon Enrollment',
        });
    },

    // to show all admins for admin side
    getAuserAdmin: function (req, res) {
        res.render('a_users_admins', {
            title: 'Admins',
        })
    },

    // to show the profile of an admin for admin side
    getAuserAProf: function (req, res) {
        res.render('a_users_AProfile', {
            title: 'Admin',
        });
    },

    // to show all accounts of all of the parent's children for admin side
    getAuserPAcc: function (req, res) {
        res.render('a_users_PAccount', {
            title: 'Admin',
        });
    },

    // to show all of the parents for admin side
    getAuserParent: function (req, res) {
        res.render('a_users_parents', {
            title: 'Parents',
        });
    },

    //to show the profile of a parent for admin side 
    getAuserPProf: function (req, res) {
        res.render('a_users_PProfile', {
            title: 'Parent',
        });
    },

    // to show a students account for admin side
    getAuserSAcc: function (req, res) {
        res.render('a_users_SAccount', {
            title: 'Student',
        });
    },

    // to show page for sending a student an email for admin side
    getAuserSEmail: function (req, res) {
        res.render('a_users_SEmail', {
            title: 'Send Email',
        });
    },

    // to show a students profile for admin side
    getAuserSProf: function (req, res) {
        res.render('a_users_SProfile', {
            title: 'Student',
        });
    },

    /* 
        TEACHER FUCNTIONS
    */

    // to show the students from the teachers dis
    getTuserStudents: function (req, res) {
        res.render('t_users_students', {
            title: 'Students'
        });
    },

    /*
        PARENT FUNCTIONS
    */
    // to show paying for enrollment (bank) from the parents side
    getPpaybank: function (req, res) {
        res.render('p_pay_bank', {
            title: 'Payment'
        });
    },

    // to show selecting of payment plan for enrollment (bank) from the parents side
    getPpayBPlan: function (req, res) {
        res.render('p_pay_BPlan', {
            title: 'Payment'
        });
    },

    // to show paying for enrollment (credit card) from the parents side
    getPpaycc: function (req, res) {
        res.render('p_pay_cc', {
            title: 'Payment'
        });
    },

    // to show selecting of payment plan for enrollment (credit card) from the parents side
    getPpayCCPlan: function (req, res) {
        res.render('p_pay_CCPlan', {
            title: 'Payment'
        });
    },

    // to show the breakdown of details from the parents side
    getPtransBD: function (req, res) {
        res.render('p_trans_BD', {
            title: 'Breakdown of Details'
        });
    },

    // to show the Statement of Accounts from the parents side
    getPtransSA: function (req, res) {
        res.render('p_trans_SA', {
            title: 'Statement of Accounts'
        });
    },

    /*
        STUDENT FUNCTIONS 
    */
    // to show the breakdown of details from the students side

    /* 
        Enrollment Functions
    */


    getEnrollmentNew: async function (req, res) {
        try {
            var sections = await getCurrentSections()
            console.log(sections);
            res.render('s_enroll_new.hbs', {
                title: 'Enrollment Page',
                sections: sections
            })
        } catch (e) {
            console.log(e)
        }
    },

    getEnrollemtOld: async function (req, res) {
        var oldStudent = await get
    },

    getStransBD: function (req, res) {
        res.render('s_trans_BD', {
            title: 'Breakdown of details'
        });
    },
}

module.exports = indexFunctions;