// 
const fs = require('fs');
const handlebars = require('handlebars');
const generator = require('generate-password');
// 

const userModel = require("../model/usersdb");
const adminModel = require("../model/admindb");
const teacherModel = require("../model/teacherdb");
const parentModel = require("../model/parentsdb");
const studentModel = require("../model/studentdb");
const sectionModel = require("../model/sectiondb");
const schoolYearModel = require("../model/schoolYeardb");
const studentDetailsModel = require("../model/studentDetailsdb");
const sectionMemberModel = require("../model/sectionMembersdb");

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

function Student(userID, mobileNum, teleNum, nationality, birthDate, birthPlace, email, religion, address) {
    this.userID = userID;
    this.parentID = '';
    this.mobileNum = mobileNum;
    this.teleNum = teleNum;
    this.nationality = nationality;
    this.birthDate = birthDate;
    this.birthPlace = birthPlace;
    this.email = email;
    this.religion = religion;
    this.address = address;
}

function Student(userID, mobileNum, teleNum, nationality, birthDate, birthPlace, email, religion, address, parentID) {
    this.userID = userID;
    this.parentID = parentID;
    this.mobileNum = mobileNum;
    this.teleNum = teleNum;
    this.nationality = nationality;
    this.birthDate =new Date(birthDate);
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

function studentDetails(studentID, familyRecords,reason) {
    this.studentID = studentID;
    this.familyRecords = familyRecords;
    this.reason = reason;
    this.eduBackground = [];
}

function studentDetails(studentID, familyRecords, reason,eduBackground,) {
    this.studentID = studentID;
    this.familyRecords = familyRecords;
    this.eduBackground = eduBackground;
    this.reason = reason;
}

function sectionMembers(sectionID,studentID){
    this.sectionID = sectionID;
    this.studentID = studentID;
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

async function getNextStudentID(){
    var schoolYear = await getCurrentSY();
    var start = schoolYear.substr(2,3);
    var nextStudent;
    var leadingzeroes;
    var studentNum;
    var students = await studentModel.aggregate([
        {
          '$match': {
            'userID': {
              '$regex': new RegExp(start)
            }
          }
        }, {
          '$sort': {
            'userID': -1
          }
        }, {
          '$limit': 1
        }, {
          '$project': {
            'userID': 1
          }
        }
      ]);
    //   console.log(start);
    if(students.length == 0)
      return  start + '000001'
    else {
        studentNum = students[0].userID.substring(3);
        studentNum = parseInt(studentNum.toString());
        studentNum++;

        leadingzeroes = 6 - studentNum.toString().length;
        // console.log(leadingzeroes);

        nextStudent = '' + start;

        for(var i = 0; i < leadingzeroes; i++)
            nextStudent = nextStudent + '0';
        
        nextStudent = nextStudent + studentNum.toString();

        return nextStudent;
    }
   // var highestID = students[0].userID;
  //  console.log(highestID);
    return true;
}
const indexFunctions = {
    /* 
        LOGIN FUNCTIONS    
    */

    // to show the login page
    getLogin: function (req, res) {
        req.session.destrory();
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
        var schoolYear = await schoolYearModel.aggregate(
            [
                {
                  '$project': {
                    'value': '$schoolYear', 
                    'selected': '$isCurrent'
                  }
                }
              ]
        );
        res.render('a_users_students', {
            // firstname: req.session.logUser.firstName,
            // middlename: req.session.logUser.middleName,
            // lastname: req.session.logUser.lastName,
            title: 'Students',
            schoolYear: schoolYear,
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
    getPaccNChild: function (req, res) {
        res.render('p_acc_NChild', {
            title: 'Register new Child'
        });
    },


    /*
        STUDENT FUNCTIONS 
    */
    // to show the breakdown of details from the students side

    /* 
        Enrollment Functions
    */


    getEnrollmentNew: async function (req,res){
        try {
            var sections = await getCurrentSections()
            // console.log(sections);
            res.render('s_enroll_new.hbs', {
                title: 'Enrollment Page',
                sections: sections
            })
        } catch (e) {
            console.log(e)
        }
    },

    getEnrollmentParent: async function (req, res) {
        res.render('s_enroll_parent', {
            title: 'Register Parent'
        });
    },

    // getEnrollemtOld: async function (req, res) {
    //     var oldStudent = await get
    // }

    getStransBD: function (req, res) {
        res.render('s_trans_BD', {
            title: 'Breakdown of details'
        });
    },
    
    // Function is used to create new students
    postEnrollmentNew: async function (req,res){
        var {
            userInfo,
            studentDetail,
            studentData,
            sectionID
        } = req.body;
        try{
            console.log(userInfo);
            console.log(studentDetail);
            console.log(studentData);

            var userID = await getNextStudentID();
            var password = generator.generate({
                length:12, numbers : true
            });
            console.log(password)
            var hash = await bcrypt.hash(password,saltRounds)

            // create user
            var user = new User(userID,hash,userInfo.firstName,userInfo.lastName,userInfo.middleName,'S',userInfo.gender);
            var newUser = new userModel(user);
            var userResult = await newUser.recordNewUser();
            // console.log(userResult);
            //create student
            if(userResult){
                var student = new Student(userID,studentData.mobileNum,studentData.teleNum,studentData.nationality,
                    studentData.birthDate,studentData.birthPlace,studentData.email,studentData.religion,
                    studentData.address);
                // console.log(student);
                var newStudent = new studentModel(student);
                var studentResult = await newStudent.recordNewStudent();
                // console.log(studentResult);

                // create student details
                // reminder to self, add siblings and education background
                if(studentResult){
                    var studentDetailsData = new studentDetails(userID, studentDetail.familyRecords,studentDetail.reason);
                    var newStudentDetails = new studentDetailsModel(studentDetailsData);
                    var studentDetailsResult = await newStudentDetails.recordNewStudentDetails();
                    
                    var sectionMemberData = new sectionMembers(sectionID,userID);
                    console.log(sectionMemberData);
                    var newSectionMember = new sectionMemberModel(sectionMemberData);
                    var sectionMemberResult = await newSectionMember.recordNewSectionMember();
                    console.log(sectionMemberResult)
                    if(studentDetailsResult && sectionMemberResult)
                    {
                        req.session.studentID = userID;
                        console.log(req.session);
                        res.send({
                            status : 201,
                            userID : userID,
                            password : password
                        })
                    }
                    else{
                        res.send({
                            status : 401,
                            msg : 'There is an error when adding user'
                        });
                    }
                }
                else{
                    res.send({
                        status : 401,
                        msg : 'There is an error when adding user'
                    })
                }
            }
            else{
                res.send({
                    status : 401,
                    msg : 'There is an error when adding user'
                })
            }
            res.send({status :500, msg : 'Something went Wrong'});
        }catch(e){
            //res.send({status : 500, msg : e});
            console.log('It entered the catch');
        }
    }
}

module.exports = indexFunctions;