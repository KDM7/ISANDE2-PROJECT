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
const subjectModel = require("../model/subjectdb");
const sectionMemberModel = require("../model/sectionMembersdb");
const ref_sectionModel = require("../model/ref_sectiondb");
const studentMembersModel = require("../model/sectionMembersdb");
const eventModel = require("../model/eventdb");
const paymentModel = require("../model/paymentdb");
const classModel = require("../model/classdb");
const upon_enrollmentModel = require("../model/upon_enrollmentdb");
const cc_paymentModel = require("../model/cc_paymentdb");
const bank_paymentModel = require("../model/bank_paymentdb");
const feesModel = require("../model/feesdb");

const bcrypt = require('bcrypt');
const e = require('express');
const {
    aggregate
} = require('../model/usersdb');
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

function Parent(userID, phoneNum, nationality, birthDate, birthPlace) {
    this.userID = userID;
    this.phoneNum = phoneNum;
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
    this.birthDate = new Date(birthDate);
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

function Payment(paymentID, amountPaid, datePaid, paymentPlan, studentID, sectionID) {
    this.paymentID = paymentID;
    this.amountPaid = amountPaid;
    this.datePaid = new Date(datePaid);
    this.paymentPlan = paymentPlan;
    this.studentID = studentID;
    this.sectionID = sectionID;
}

function schoolYear(schoolYear, isCurrent) {
    this.schoolYear = schoolYear;
    this.isCurrent = isCurrent;
}

function CC_Payment(paymentID, ccType, ccExp, ccHolderName) {
    this.paymentID = paymentID;
    this.ccType = ccType;
    this.ccExp = ccExp;
    this.ccHolderName = ccHolderName;
}

function Bank_Payment(paymentID, accountName, accountNumber) {
    this.paymentID = paymentID;
    this.accountName = accountName;
    this.accountNumber = accountNumber;
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

function studentDetails(studentID, familyRecords, reason) {
    this.studentID = studentID;
    this.familyRecords = familyRecords;
    this.reason = reason;
    this.eduBackground = [];
}

function studentDetails(studentID, familyRecords, reason, eduBackground, ) {
    this.studentID = studentID;
    this.familyRecords = familyRecords;
    this.eduBackground = eduBackground;
    this.reason = reason;
}

function sectionMembers(sectionID, studentID, remarks) {
    this.sectionID = sectionID;
    this.studentID = studentID;
    this.remarks = remarks
}

function Event(eventID, eventName, eventDate, schoolYear) {
    this.eventID = eventID;
    this.eventName = eventName;
    this.eventDate = new Date(eventDate);
    this.schoolYear = schoolYear;
}

function Class(classID, teacherID, sectionID, subjectCode) {
    this.classID = classID;
    this.teacherID = teacherID;
    this.sectionID = sectionID;
    this.subjectCode = subjectCode;
}

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



async function getSectionReport(schoolYear) {
    return await sectionModel.aggregate([{
        '$lookup': {
            'from': 'payments',
            'localField': 'sectionID',
            'foreignField': 'sectionID',
            'as': 'pmtDta'
        }
    }, {
        '$unwind': {
            'path': '$pmtDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'bank_payment',
            'localField': 'pmtDta.paymentID',
            'foreignField': 'paymentID',
            'as': 'bnkDta'
        }
    }, {
        '$lookup': {
            'from': 'cc_payment',
            'localField': 'pmtDta.paymentID',
            'foreignField': 'paymentID',
            'as': 'ccDta'
        }
    }, {
        '$unwind': {
            'path': '$bnkDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$unwind': {
            'path': '$ccDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$match': {
            'schoolYear': schoolYear
        }
    }, {
        '$group': {
            '_id': '$sectionID',
            'ccPayment': {
                '$sum': {
                    '$cond': [
                        '$ccDta.ccType', '$pmtDta.amountPaid', ''
                    ]
                }
            },
            'bnkPayment': {
                '$sum': {
                    '$cond': [
                        '$bnkDta.accountNumber', '$pmtDta.amountPaid', ''
                    ]
                }
            },
            'payments': {
                '$sum': '$pmtDta.amountPaid'
            }
        }
    }, {
        '$lookup': {
            'from': 'sections',
            'localField': '_id',
            'foreignField': 'sectionID',
            'as': 'secDta'
        }
    }, {
        '$unwind': {
            'path': '$secDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'ref_section',
            'localField': 'secDta.sectionName',
            'foreignField': 'sectionName',
            'as': 'refSec'
        }
    }, {
        '$unwind': {
            'path': '$refSec',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$project': {
            '_id': 0,
            'sectionID': '$_id',
            'ccPayment': 1,
            'bnkPayment': 1,
            'payments': 1,
            'sectionName': '$secDta.sectionName',
            'gradeLvl': '$refSec.gradeLvl'
        }
    }, {
        '$sort': {
          'gradeLvl': 1
        }
      }]);
}

async function getBankReportTotal(schoolYear) {
    var total = await bank_paymentModel.aggregate([{
        '$lookup': {
            'from': 'payments',
            'localField': 'paymentID',
            'foreignField': 'paymentID',
            'as': 'pmtDta'
        }
    }, {
        '$unwind': {
            'path': '$pmtDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'sections',
            'localField': 'pmtDta.sectionID',
            'foreignField': 'sectionID',
            'as': 'secDta'
        }
    }, {
        '$unwind': {
            'path': '$secDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$group': {
            '_id': '$secDta.sectionID',
            'amountPaid': {
                '$sum': '$pmtDta.amountPaid'
            }
        }
    }, {
        '$lookup': {
            'from': 'sections',
            'localField': '_id',
            'foreignField': 'sectionID',
            'as': 'secDta'
        }
    }, {
        '$unwind': {
            'path': '$secDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'ref_section',
            'localField': 'secDta.sectionName',
            'foreignField': 'sectionName',
            'as': 'refSec'
        }
    }, {
        '$unwind': {
            'path': '$refSec',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$project': {
            '_id': 0,
            'amountPaid': 1,
            'sectionID': '$_id',
            'sectionName': '$secDta.sectionName',
            'gradeLvl': '$refSec.gradeLvl',
            'schoolYear': '$secDta.schoolYear',
            'sectionAdviser': '$secDta.sectionAdviser'
        }
    }, {
        '$match': {
            'schoolYear': schoolYear
        }
    }, {
        '$group': {
            '_id': null,
            'total': {
                '$sum': '$amountPaid'
            }
        }
    }]);
    return total[0].total;
}

async function getCCReportTotal(schoolYear) {
    var total = await cc_paymentModel.aggregate([{
        '$lookup': {
            'from': 'payments',
            'localField': 'paymentID',
            'foreignField': 'paymentID',
            'as': 'pmtDta'
        }
    }, {
        '$unwind': {
            'path': '$pmtDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'sections',
            'localField': 'pmtDta.sectionID',
            'foreignField': 'sectionID',
            'as': 'secDta'
        }
    }, {
        '$unwind': {
            'path': '$secDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$group': {
            '_id': '$secDta.sectionID',
            'amountPaid': {
                '$sum': '$pmtDta.amountPaid'
            }
        }
    }, {
        '$lookup': {
            'from': 'sections',
            'localField': '_id',
            'foreignField': 'sectionID',
            'as': 'secDta'
        }
    }, {
        '$unwind': {
            'path': '$secDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'ref_section',
            'localField': 'secDta.sectionName',
            'foreignField': 'sectionName',
            'as': 'refSec'
        }
    }, {
        '$unwind': {
            'path': '$refSec',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$project': {
            '_id': 0,
            'amountPaid': 1,
            'sectionID': '$_id',
            'sectionName': '$secDta.sectionName',
            'gradeLvl': '$refSec.gradeLvl',
            'schoolYear': '$secDta.schoolYear',
            'sectionAdviser': '$secDta.sectionAdviser'
        }
    }, {
        '$match': {
            'schoolYear': schoolYear
        }
    }, {
        '$group': {
            '_id': null,
            'total': {
                '$sum': '$amountPaid'
            }
        }
    }]);
    return total[0].total;
}

async function getPaymentReportTotal(schoolYear) {
    var total = await paymentModel.aggregate([{
        '$lookup': {
            'from': 'sections',
            'localField': 'sectionID',
            'foreignField': 'sectionID',
            'as': 'secDta'
        }
    }, {
        '$unwind': {
            'path': '$secDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$group': {
            '_id': '$secDta.sectionID',
            'amountPaid': {
                '$sum': '$amountPaid'
            }
        }
    }, {
        '$lookup': {
            'from': 'sections',
            'localField': '_id',
            'foreignField': 'sectionID',
            'as': 'secDta'
        }
    }, {
        '$unwind': {
            'path': '$secDta',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'ref_section',
            'localField': 'secDta.sectionName',
            'foreignField': 'sectionName',
            'as': 'refSec'
        }
    }, {
        '$unwind': {
            'path': '$refSec',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$project': {
            '_id': 0,
            'amountPaid': 1,
            'sectionID': '$_id',
            'sectionName': '$secDta.sectionName',
            'gradeLvl': '$refSec.gradeLvl',
            'schoolYear': '$secDta.schoolYear',
            'sectionAdviser': '$secDta.sectionAdviser'
        }
    }, {
        '$match': {
            'schoolYear': schoolYear
        }
    }, {
        '$group': {
            '_id': null,
            'total': {
                '$sum': '$amountPaid'
            }
        }
    }]);
    return total[0].total;
}

async function findAdminDetails() {
    var user = await userModel.aggregate([{
        '$match': {
            'type': 'A'
        }
    }, {
        '$lookup': {
            'from': 'admins',
            'localField': 'userID',
            'foreignField': 'userID',
            'as': 'admin'
        }
    }, {
        '$unwind': {
            'path': '$admin',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$project': {
            'userID': 1,
            'password': 1,
            'firstName': 1,
            'lastName': 1,
            'middleName': 1,
            'type': 1,
            'gender': 1,
            'dateCreated': '$admin.dateCreated'
        }
    }]);
    return user;
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
//gets the prefix for most of the numerical ids
async function getIDPrefix() {
    var schoolYear = await getCurrentSY();
    return schoolYear.substr(2, 3);
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
async function getSectionsSY(schoolYear) {
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
async function getNextSectionEnrollment(sectionID, remark) {
    var sectionID = sectionID;
    var remark = remark;
    try {
        var sectionData = await sectionModel.findOne({
            sectionID: sectionID
        });
        var sectionName = sectionData.sectionName;
        if (remark == "R") {

        } else if (remark == "P") {
            if (sectionName == "Jupiter")
                sectionName = "Saturn";
            else if (sectionName == "Saturn")
                sectionName = "Venus";
        }
        var nextSection = await sectionModel.aggregate([{
            '$match': {
                'sectionName': sectionName
            }
        }, {
            '$sort': {
                'schoolYear': -1
            }
        }, {
            '$project': {
                'sectionID': 1,
                'sectionName': 1
            }
        }]);
        return nextSection[0].sectionID;
    } catch (e) {
        res.send({
            status: 500,
            msg: e
        });
    }
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
//get profile of student using studentID(to identify the student) and schoolYear(to identify which year so it will return only 1 record)
async function getSProfile(studentID, schoolYear) {
    var profile = await userModel.aggregate(
        [{
            '$match': {
                'userID': studentID.toString()
            }
        }, {
            '$lookup': {
                'from': 'students',
                'localField': 'userID',
                'foreignField': 'userID',
                'as': 'studentData'
            }
        }, {
            '$unwind': {
                'path': '$studentData',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'studentMembers',
                'localField': 'userID',
                'foreignField': 'studentID',
                'as': 'memberData'
            }
        }, {
            '$unwind': {
                'path': '$memberData',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'sections',
                'localField': 'memberData.sectionID',
                'foreignField': 'sectionID',
                'as': 'sectionData'
            }
        }, {
            '$unwind': {
                'path': '$sectionData',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$match': {
                'sectionData.schoolYear': schoolYear.toString()
            }
        }, {
            '$lookup': {
                'from': 'ref_section',
                'localField': 'sectionData.sectionName',
                'foreignField': 'sectionName',
                'as': 'ref_section'
            }
        }, {
            '$unwind': {
                'path': '$ref_section',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'student_details',
                'localField': 'userID',
                'foreignField': 'studentID',
                'as': 'student_details'
            }
        }, {
            '$unwind': {
                'path': '$student_details',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': 0,
                'userID': 1,
                'firstName': 1,
                'lastName': 1,
                'middleName': 1,
                'gradeLvl': '$ref_section.gradeLvl',
                'gender': 1,
                'birthDate': '$studentData.birthDate',
                'birthPlace': '$studentData.birthPlace',
                'nationality': '$studentData.nationality',
                'religion': '$studentData.religion',
                'telNo': '$studentData.teleNum',
                'cellNo': '$studentData.mobileNum',
                'email': '$studentData.email',
                'address': '$studentData.address',
                'familyRecords': '$student_details.familyRecords',
                'reason': '$student_details.reason',
                'remark': '$memberData.remarks'
            }
        }]
    );
    return profile[0]; //returns the only object in the array
}

// get a list of students using 'schoolYear' an 'gradeLvl' as parameters
async function getStudentListSYGL(schoolYear, gradeLvl) {
    try {
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
                '$lookup': {
                    'from': 'studentMembers',
                    'localField': 'userID',
                    'foreignField': 'studentID',
                    'as': 'memberData'
                }
            }, {
                '$unwind': {
                    'path': '$memberData',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$match': {
                    'memberData.sectionID': {
                        '$in': sections
                    }
                }
            }, {
                '$lookup': {
                    'from': 'sections',
                    'localField': 'memberData.sectionID',
                    'foreignField': 'sectionID',
                    'as': 'sectionData'
                }
            }, {
                '$unwind': {
                    'path': '$sectionData',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'userID': 1,
                    'firstname': '$userData.firstName',
                    'middlename': '$userData.middleName',
                    'lastname': '$userData.lastName',
                    'remark': '$memberData.remarks',
                    'schoolYear': '$sectionData.schoolYear'
                }
            }]
        );
    } catch {
        studentList = null;
    }
    return studentList;
}
async function getStudentSY(studentID) {
    return await studentModel.aggregate( //get school years in database base on the sectons of the student for display in dropdown element
        [{
            '$match': {
                'userID': studentID
            }
        }, {
            '$lookup': {
                'from': 'studentMembers',
                'localField': 'userID',
                'foreignField': 'studentID',
                'as': 'mbrDta'
            }
        }, {
            '$unwind': {
                'path': '$mbrDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$lookup': {
                'from': 'sections',
                'localField': 'mbrDta.sectionID',
                'foreignField': 'sectionID',
                'as': 'secDta'
            }
        }, {
            '$unwind': {
                'path': '$secDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': 0,
                'value': '$secDta.schoolYear'
            }
        }]
    );
}

// gets the list of sections for the student
async function getStudentMembership(studentID) {
    var studentID = studentID;
    var membersList = await studentMembersModel.aggregate([{
        '$match': {
            'studentID': studentID
        }
    }, {
        '$sort': {
            'sectionID': -1
        }
    }]);
    return membersList;
}
async function getUnavailableTch() {
    var unavailableTch = await sectionModel.aggregate([{
        '$group': {
            '_id': null,
            'advisers': {
                '$push': '$sectionAdviser'
            }
        }
    }]);
    return unavailableTch[0].advisers
}
async function getAvailableTch() {
    var unavailableTch = await getUnavailableTch();
    var availableTch = await teacherModel.aggregate(
        [{
            '$match': {
                'userID': {
                    '$not': {
                        '$in': unavailableTch
                    }
                }
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'userID',
                'foreignField': 'userID',
                'as': 'usrDta'
            }
        }, {
            '$unwind': {
                'path': '$usrDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                'userID': 1,
                'name': {
                    '$concat': [
                        '$usrDta.firstName', ' ', '$usrDta.middleName', ' ', '$usrDta.lastName'
                    ]
                }
            }
        }]
    );
    return availableTch;
}
/*
    Gets user information of students under a specific parentID
*/
async function getStudentListParentID(parentID) {
    var studentList = await studentModel.aggregate([{
        '$match': {
            'parentID': parentID
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
        '$lookup': {
            'from': 'studentMembers',
            'localField': 'userID',
            'foreignField': 'studentID',
            'as': 'sectionIdentity'
        }
    }, {
        '$unwind': {
            'path': '$sectionIdentity',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'sections',
            'localField': 'sectionIdentity.sectionID',
            'foreignField': 'sectionID',
            'as': 'section'
        }
    }, {
        '$unwind': {
            'path': '$section',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'ref_section',
            'localField': 'section.sectionName',
            'foreignField': 'sectionName',
            'as': 'sectionName'
        }
    }, {
        '$unwind': {
            'path': '$sectionName',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$project': {
            'userID': 1,
            'firstName': '$userData.firstName',
            'middleName': '$userData.middleName',
            'lastName': '$userData.lastName',
            'gradeLvl': '$sectionName.gradeLvl',
            '_id': 0
        }
    }]);

    return studentList;
}

//get unenrolled students
// async function getUnenrolledStudentListParentID(parentID)
// {
//     var studentList = getStudentListParentID(parentID);
//     var sections = getCurrentSections();


//     return studentList;
// }
async function getNextStudentID() {
    var schoolYear = await getCurrentSY();
    var start = schoolYear.substr(2, 3);
    var nextStudent;
    var leadingzeroes;
    var studentNum;
    var students = await studentModel.aggregate([{
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
    }]);
    //   console.log(start);
    if (students.length == 0)
        return start + '000001'
    else {
        studentNum = students[0].userID.substring(3);
        studentNum = parseInt(studentNum.toString());
        studentNum++;

        leadingzeroes = 6 - studentNum.toString().length;
        // console.log(leadingzeroes);

        nextStudent = '' + start;

        for (var i = 0; i < leadingzeroes; i++)
            nextStudent = nextStudent + '0';

        nextStudent = nextStudent + studentNum.toString();

        return nextStudent;
    }
    // var highestID = students[0].userID;
    //  console.log(highestID);
}

function renamePaymentPlan(string) {
    switch (string) {
        case "nextPayment":
            return "Next"
            break;
        case "fullPayment":
            return "Full";
            break;
        case "remainingPayment":
            return "Remaining";
            break;
        case "semestralPayment":
            return "Semestral";
            break;
        case "trimestralPayment":
            return "Trimestral";
            break;
        case "quarterlyPayment":
            return "Quarterly";
            break;
        case "monthlyPayment":
            return "Monthly";
            break;
    }
}
async function getNextPaymentID() {
    var startNum = 1;
    var schoolYear = await getIDPrefix();
    schoolYear = parseInt(schoolYear.substr(0, 2));

    startNum = (startNum * 10000000) + (schoolYear * 100000) + 1;
    var payments = await paymentModel.aggregate([{
        '$match': {
            'paymentID': {
                '$gte': startNum
            }
        }
    }, {
        '$sort': {
            'paymentID': -1
        }
    }, {
        '$limit': 1
    }, {
        '$project': {
            'paymentID': 1
        }
    }]);

    if (payments.length != 0) {
        return payments[0].paymentID + 1;
    } else {
        return startNum;
    }
}

async function getNextClassID() {
    var startNum = 1;
    var schoolYear = await getIDPrefix();
    schoolYear = parseInt(schoolYear.substr(0, 2));

    startNum = (startNum * 30000000) + (schoolYear * 100000) + 1;
    var classID = await classModel.aggregate([{
        '$match': {
            'classID': {
                '$gte': startNum
            }
        }
    }, {
        '$sort': {
            'classID': -1
        }
    }, {
        '$limit': 1
    }, {
        '$project': {
            'classID': 1
        }
    }]);

    if (classID.length != 0) {
        return classID[0].classID + 1;
    } else {
        return startNum;
    }
}

async function getClassList(schoolYear) {
    //retrieves a list of all the classes in a given school year sorted into sections
    /**
     * e.g.
     * _id: 'Jupiter'
     * cList:Array
     *  0:Object
     *      subNm: 'Araling Panlipunan'
     *      tchFNm: 'Lonnie'
     *      tchMNm: 'Tapson'
     *      tchLNm: 'Graeber'
     * 1:Object
     * 2:Object
     */
    return await classModel.aggregate(
        [{
            '$lookup': {
                'from': 'sections',
                'localField': 'sectionID',
                'foreignField': 'sectionID',
                'as': 'secDta'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'teacherID',
                'foreignField': 'userID',
                'as': 'tchDta'
            }
        }, {
            '$lookup': {
                'from': 'subjects',
                'localField': 'subjectCode',
                'foreignField': 'subjectCode',
                'as': 'subDta'
            }
        }, {
            '$match': {
                'secDta.schoolYear': schoolYear
            }
        }, {
            '$unwind': {
                'path': '$tchDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$unwind': {
                'path': '$secDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$unwind': {
                'path': '$subDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$group': {
                '_id': '$secDta.sectionName',
                'cList': {
                    '$push': {
                        'subNm': '$subDta.subjectName',
                        'tchFNm': '$tchDta.firstName',
                        'tchMNm': '$tchDta.middleName',
                        'tchLNm': '$tchDta.lastName'
                    }
                }
            }
        }, {
            '$lookup': {
                'from': 'ref_section',
                'localField': '_id',
                'foreignField': 'sectionName',
                'as': 'refSec'
            }
        }, {
            '$lookup': {
                'from': 'sections',
                'localField': '_id',
                'foreignField': 'sectionName',
                'as': 'secDta'
            }
        }, {
            '$unwind': {
                'path': '$refSec',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$unwind': {
                'path': '$secDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$match': {
                'secDta.schoolYear': schoolYear
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'secDta.sectionAdviser',
                'foreignField': 'userID',
                'as': 'usrDta'
            }
        }, {
            '$unwind': {
                'path': '$usrDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': 1,
                'secID': '$secDta.sectionID',
                'cList': 1,
                'gradeLvl': '$refSec.gradeLvl',
                'adviser': {
                    '$concat': [
                        '$usrDta.firstName', ' ', '$usrDta.middleName', ' ', '$usrDta.lastName'
                    ]
                }
            }
        }, {
            '$sort': {
                'gradeLvl': 1
            }
        }]
    );
}
async function getClass(sectionID, schoolYear) {
    var cls = await classModel.aggregate(
        [{
            '$match': {
                'sectionID': parseInt(sectionID)
            }
        }, {
            '$lookup': {
                'from': 'sections',
                'localField': 'sectionID',
                'foreignField': 'sectionID',
                'as': 'secDta'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'teacherID',
                'foreignField': 'userID',
                'as': 'tchDta'
            }
        }, {
            '$lookup': {
                'from': 'subjects',
                'localField': 'subjectCode',
                'foreignField': 'subjectCode',
                'as': 'subDta'
            }
        }, {
            '$match': {
                'secDta.schoolYear': schoolYear
            }
        }, {
            '$unwind': {
                'path': '$tchDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$unwind': {
                'path': '$secDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$unwind': {
                'path': '$subDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$group': {
                '_id': '$secDta.sectionName',
                'cList': {
                    '$push': {
                        'subNm': '$subDta.subjectName',
                        'tchFNm': '$tchDta.firstName',
                        'tchMNm': '$tchDta.middleName',
                        'tchLNm': '$tchDta.lastName',
                        'clsID': '$classID'
                    }
                }
            }
        }, {
            '$lookup': {
                'from': 'ref_section',
                'localField': '_id',
                'foreignField': 'sectionName',
                'as': 'refSec'
            }
        }, {
            '$lookup': {
                'from': 'sections',
                'localField': '_id',
                'foreignField': 'sectionName',
                'as': 'secDta'
            }
        }, {
            '$unwind': {
                'path': '$refSec',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$unwind': {
                'path': '$secDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$match': {
                'secDta.schoolYear': schoolYear
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'secDta.sectionAdviser',
                'foreignField': 'userID',
                'as': 'usrDta'
            }
        }, {
            '$unwind': {
                'path': '$usrDta',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                '_id': 1,
                'secID': '$secDta.sectionID',
                'adviserID': '$usrDta.userID',
                'cList': 1,
                'gradeLvl': '$refSec.gradeLvl',
                'adviser': {
                    '$concat': [
                        '$usrDta.firstName', ' ', '$usrDta.middleName', ' ', '$usrDta.lastName'
                    ]
                }
            }
        }]
    );
    return cls[0];
}
async function getStudentClassList(userID,sectionID)
{
    var classList = studentModel.aggregate([
        {
          '$match': {
            'userID': userID
          }
        }, {
          '$lookup': {
            'from': 'studentMembers', 
            'localField': 'userID', 
            'foreignField': 'studentID', 
            'as': 'studentMembers'
          }
        }, {
          '$unwind': {
            'path': '$studentMembers', 
            'preserveNullAndEmptyArrays': false
          }
        }, {
          '$match': {
            'studentMembers.sectionID': sectionID
          }
        }, {
          '$lookup': {
            'from': 'classes', 
            'localField': 'studentMembers.sectionID', 
            'foreignField': 'sectionID', 
            'as': 'classes'
          }
        }, {
          '$unwind': {
            'path': '$classes', 
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            '_id': 0, 
            'classID': '$classes.classID'
          }
        }
      ]);
      return classList;
}
async function getParentChildren(userID) {
    var user = await userModel.aggregate([{
        '$match': {
            'type': 'S'
        }
    }, {
        '$lookup': {
            'from': 'students',
            'localField': 'userID',
            'foreignField': 'userID',
            'as': 'students'
        }
    }, {
        '$unwind': {
            'path': '$students',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'parents',
            'localField': 'students.parentID',
            'foreignField': 'userID',
            'as': 'parents'
        }
    }, {
        '$unwind': {
            'path': '$parents',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$match': {
            'parents.userID': userID
        }
    }, {
        '$project': {
            'studentID': '$userID',
            'value': '$userID',
            'name1': '$firstName',
            'name2': '$middleName',
            'name3': '$lastName',
            '_id': 0
        }
    }]);
    console.log(user[0].studentID);
    return user;
}
// gets the amount the student already paid, as well as the payment plan
async function getStudentPaymentsSummary(studentID, sectionID) {
    return await paymentModel.aggregate([{
        '$match': {
            'studentID': studentID,
            'sectionID': {
                '$eq': sectionID
            }
        }
    }, {
        '$sort': {
            'paymentID': 1
        }
    }, {
        '$group': {
            '_id': '$sectionID',
            'totalAmountPaid': {
                '$sum': '$amountPaid'
            },
            'paymentPlan': {
                '$first': '$paymentPlan'
            }
        }
    }]);
}

function getNextInstallment(totalPayment, initialPayment, numberOfInstallments) {
    return (totalPayment - initialPayment) / numberOfInstallments;
}

/*
    Returns amount owed on payment screen
    Error Results : 
    -1  =   User is already fully paid
    -2  =   User attempted to pay another installment
            without having an initial payment
    -3  =   User Does not select next payment when paying for their next installment
*/
async function getAmountOwed(studentID, sectionID, paymentPlan) {
    //gets amounts for upon_enrollment
    var upon_enrollment = await upon_enrollmentModel.findOne({
        sectionID: {
            $eq: sectionID
        }
    });
    console.log(upon_enrollment);
    var amountPrevPaid = await getStudentPaymentsSummary(studentID, sectionID);
    var amountDue = 0;
    //this is student's first payment
    if (amountPrevPaid.length == 0) {
        switch (paymentPlan) {
            case "nextPayment":
                amountDue = -2;
                break;
            case "fullPayment":
            case "remainingPayment":
                amountDue = upon_enrollment.fullPayment;
                break;
            case "semestralPayment":
                amountDue = upon_enrollment.semestralPayment;
                break;
            case "trimestralPayment":
                amountDue = upon_enrollment.trimestralPayment;
                break;
            case "quarterlyPayment":
                amountDue = upon_enrollment.quarterlyPayment;
                break;
            case "monthlyPayment":
                amountDue = upon_enrollment.monthlyPayment;
                break;
        }
    }
    //they have selected a payment plan in the past
    else {
        console.log(amountPrevPaid);
        if (upon_enrollment.fullPayment == amountPrevPaid[0].totalAmountPaid)
            amountDue = -1;
        else if (paymentPlan == "remainingPayment" || paymentPlan == "fullPayment") {
            amountDue = upon_enrollment.fullPayment - amountPrevPaid[0].totalAmountPaid;
        } else if (paymentPlan == "nextPayment") {
            switch (amountPrevPaid[0].paymentPlan) {
                case "Semestral":
                    amountDue = getNextInstallment(upon_enrollment.fullPayment, upon_enrollment.semestralPayment, 2);
                    break;
                case "Trimestral":
                    amountDue = getNextInstallment(upon_enrollment.fullPayment, upon_enrollment.trimestralPayment, 3);
                    break;
                case "Quarterly":
                    amountDue = getNextInstallment(upon_enrollment.fullPayment, upon_enrollment.quarterlyPayment, 4);
                    break;
                case "Monthly":
                    amountDue = getNextInstallment(upon_enrollment.fullPayment, upon_enrollment.semestralPayment, 10);
                    break;
                default:
                    amountDue = -3;
            }
        } else {
            amountDue = -3;
        }
    }
    return amountDue;
}
//gets all section information based on school year
async function getSectionList(schoolYear) {
    var sectionList = await sectionModel.aggregate([{
        '$match': {
            'schoolYear': schoolYear
        }
    }, {
        '$sort': {
            'sectionID': 1
        }
    }, {
        '$project': {
            'sectionID': 1,
            'sectionName': 1,
            'schoolYear': 1,
            'sectionAdviser': 1
        }
    }]);
    return sectionList;
}

async function getNextParentID() {
    var schoolYear = await getCurrentSY();
    var start = "PA-";
    var nextParent;
    var leadingzeroes;
    var parentNum;
    var students = await parentModel.aggregate([{
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
    }]);
    //   console.log(start);
    if (students.length == 0)
        return start + '000001'
    else {
        studentNum = students[0].userID.substring(3);
        studentNum = parseInt(studentNum.toString());
        studentNum++;

        leadingzeroes = 6 - studentNum.toString().length;
        // console.log(leadingzeroes);

        nextStudent = '' + start;

        for (var i = 0; i < leadingzeroes; i++)
            nextStudent = nextStudent + '0';

        nextStudent = nextStudent + studentNum.toString();

        return nextStudent;
    }
    // var highestID = students[0].userID;
    //  console.log(highestID);
    return true;
}

async function assignParent(parentID, studentID) {
    try {
        console.log(parentID);
        console.log(studentID);
        var result = await studentModel.findOneAndUpdate({
            userID: studentID
        }, {
            parentID: parentID
        }, {
            useFindAndModify: false
        });
        console.log(result);
        return result;
    } catch (e) {
        res.send({
            status: 500,
            msg: e
        });
    }
}
async function getMinMaxEventID(sortby, offset) {
    var highestID = await eventModel.aggregate([{
        '$sort': {
            'eventID': sortby
        }
    }, {
        '$limit': 1
    }, {
        '$project': {
            'deliveryID': 1
        }
    }]);
    return highestID[0].eventID + offset;
}

//this functions gets the Outstanding Balance Report Data
/*
    Data Required:
        StudentID
        StudentName
        Section
        Remaining Balance
*/
async function getBalanceReportData(schoolYear) {
    var sections = await getSectionsSY(schoolYear);
    var reportData = await sectionModel.aggregate([{
        '$match': {
            'sectionID': {
                '$in': sections
            }
        }
    }, {
        '$lookup': {
            'from': 'upon_enrollment',
            'localField': 'sectionID',
            'foreignField': 'sectionID',
            'as': 'upon_enrollment'
        }
    }, {
        '$unwind': {
            'path': '$upon_enrollment',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'studentMembers',
            'localField': 'sectionID',
            'foreignField': 'sectionID',
            'as': 'studentMembers'
        }
    }, {
        '$unwind': {
            'path': '$studentMembers',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$lookup': {
            'from': 'payments',
            'localField': 'studentMembers.studentID',
            'foreignField': 'studentID',
            'as': 'payments'
        }
    }, {
        '$unwind': {
            'path': '$payments',
            'preserveNullAndEmptyArrays': true
        }
    }, {
        '$match': {
            'payments.sectionID': {
                '$in': sections
            }
        }
    }, {
        '$group': {
            '_id': '$payments.studentID',
            'totalAmtPaid': {
                '$sum': '$payments.amountPaid'
            },
            'amountDue': {
                '$first': '$upon_enrollment.fullPayment'
            },
            'studentID': {
                '$first': '$studentMembers.studentID'
            },
            'sectionID': {
                '$first': '$sectionID'
            },
            'sectionName': {
                '$first': '$sectionName'
            }
        }
    }, {
        '$addFields': {
            'remainingBalance': {
                '$subtract': [
                    '$amountDue', '$totalAmtPaid'
                ]
            }
        }
    }, {
        '$match': {
            'remainingBalance': {
                '$gt': 0
            }
        }
    }, {
        '$lookup': {
            'from': 'users',
            'localField': 'studentID',
            'foreignField': 'userID',
            'as': 'studentInfo'
        }
    }, {
        '$unwind': {
            'path': '$studentInfo',
            'preserveNullAndEmptyArrays': false
        }
    }, {
        '$addFields': {
            'studentName': {
                '$concat': [
                    '$studentInfo.lastName', ',', '$studentInfo.firstName', ' ', '$studentInfo.middleName'
                ]
            }
        }
    }, {
        '$sort': {
            'sectionName': 1,
            'studentName': 1
        }
    }, {
        '$project': {
            'studentID': 1,
            'sectionName': 1,
            'remainingBalance': 1,
            'studentName': 1
        }
    }]);
    return reportData;
}

async function getTeacherClassesList(teacherID) {
    var classes = await classModel.aggregate([{
        '$match': {
            'teacherID': teacherID
        }
    }, {
        '$lookup': {
            'from': 'sections',
            'localField': 'sectionID',
            'foreignField': 'sectionID',
            'as': 'section'
        }
    }, {
        '$unwind': {
            'path': '$section',
            'preserveNullAndEmptyArrays': false
        }
    }, {
        '$sort': {
            'section.sechoolYear': -1,
            'sectionID': 1,
            'classID': 1
        }
    }, {
        '$project': {
            'classID': 1,
            'sectionID': 1,
            'subjectCode': 1,
            'schoolYear': '$section.schoolYear',
            'sectionName': '$section.sectionName'
        }
    }]);

    return classes;
}

const indexFunctions = {
    /* 
        LOGIN FUNCTIONS    
    */

    // to show the login page
    getLogin: function (req, res) {
        req.session.destroy();
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
        var initSettings = {
            schoolYear: await getCurrentSY(),
            gradeLvl: 'Grade 1'
        }
        try {
            var match = await findUser(user);
            if (match) {
                try {
                    var student = await getParentChildren(user);
                } catch (e) {}
                bcrypt.compare(pass, match.password, function (err, result) {
                    // var result = match.password == pass;
                    if (result) {
                        if (match.type == 'A') {
                            //send 201 admin
                            req.session.logUser = match;
                            req.session.type = 'admin';
                            req.session.userSettings = initSettings;
                            res.send({
                                status: 201
                            });
                        } else if (match.type == 'T') {
                            //send 202 teacher
                            req.session.logUser = match;
                            req.session.type = 'teacher';
                            req.session.userSettings = initSettings;
                            res.send({
                                status: 202
                            });
                        } else if (match.type == 'P') {
                            //send 203 parent
                            req.session.logUser = match;
                            req.session.type = 'parent';
                            req.session.userSettings = initSettings;
                            req.session.userSettings.studentID = student[0].studentID;
                            console.log(req.session);
                            res.send({
                                status: 203
                            });
                        } else {
                            //send 204 student
                            req.session.logUser = match;
                            req.session.type = 'student';
                            req.session.userSettings = initSettings;
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
    postLogout: function (req, res) {
        req.session.destroy();
        res.redirect("/");
    },
    /*      
        ADMIN FUNCTIONS
    */
    getAschedEditSection: async function (req, res) {
        var sectionID = req.params.sectionID;
        var schoolYear = req.session.userSettings.schoolYear;
        var clsDta = await getClass(sectionID, schoolYear);
        var availList = await getAvailableTch();
        var tchList = await teacherModel.aggregate(
            [{
                '$lookup': {
                    'from': 'users',
                    'localField': 'userID',
                    'foreignField': 'userID',
                    'as': 'usrDta'
                }
            }, {
                '$unwind': {
                    'path': '$usrDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'userID': 1,
                    'tchNm': {
                        '$concat': [
                            '$usrDta.firstName', ' ', '$usrDta.middleName', ' ', '$usrDta.lastName'
                        ]
                    }
                }
            }]
        );

        for (var i = 0; i < clsDta.cList.length; i++)
            clsDta.cList[i].tchList = tchList;

        res.render('a_sched_EditSection', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Edit Section',
            clsDta: clsDta,
            tchList: tchList,
            availList: availList
        })
    },
    postEditClass: async function (req, res) {
        try {
            var classID = req.body.clsID;
            var teacherID = req.body.tchID;

            await classModel.findOneAndUpdate({
                classID: classID
            }, {
                teacherID: teacherID
            }, {
                useFindAndModify: false
            });
            res.send({
                status: 200,
                msg: 'Class Updated'
            });
        } catch (e) {
            console.log(e);
            res.send({
                status: 500,
                msg: 'An error has occured'
            });
        }
    },
    postSectionAdviser: async function (req, res) {
        try {
            var sectionID = req.body.sectionID;
            var adviserID = req.body.adviserID;
            await sectionModel.findOneAndUpdate({
                sectionID: sectionID
            }, {
                sectionAdviser: adviserID
            }, {
                useFindAndModify: false
            });
            res.send({
                status: 200,
                msg: 'Adviser Updated'
            });
        } catch (e) {
            console.log(e);
            res.send({
                status: 500,
                msg: 'An error has occured'
            });
        }
    },
    // to show the students from the admins side
    getAuserStudents: async function (req, res) {
        // after grades have been set up: may have to merge student and another var grades instead of trying to aggregate for remarks
        var schoolYear = await schoolYearModel.aggregate( //get school years in database for display in dropdown element
            [{
                '$project': {
                    'value': '$schoolYear',
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
        var students = await getStudentListSYGL(req.session.userSettings.schoolYear, req.session.userSettings.gradeLvl);
        res.render('a_users_students', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Students',
            schoolYear: schoolYear,
            SYSettings: req.session.userSettings.schoolYear,
            gradeLvl: gradeLvl,
            GLSettings: req.session.userSettings.gradeLvl,
            student: students
        });
    },
    // to show edit student agreements page for admins side
    getAdocEditSA: function (req, res) {
        res.render('a_doc_editSA', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Edit Student Agreement',
        });
    },

    // to show edit student documents page for admins side
    getAdocEditSD: function (req, res) {
        res.render('a_doc_editSD', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Edit Student Document',
        });
    },

    // to show new student agreements page for admin side
    getAdocNewSA: function (req, res) {
        res.render('a_doc_newSA', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'New Student Agreement',
        });
    },

    // to show new student documents page for admin side
    getAdocNewSD: function (req, res) {
        res.render('a_doc_newSD', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'New Student Document',
        });
    },

    // to show student agreements page for admin side
    getAdocSA: function (req, res) {
        res.render('a_doc_SA', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student Agreement',
        });
    },

    // to show student documents page for admin side
    getAdocSD: function (req, res) {
        res.render('a_doc_SD', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student Document',
        });
    },

    // to show Additional Fees page for admin side
    getAfeeAdd: function (req, res) {
        res.render('a_fees_add', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Additional Fees',
        });
    },

    // to show Edit Upon Enrollment page for admin side
    getAfeeEditUE: function (req, res) {
        res.render('a_fees_editUE', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Edit Upon Enrollment'
        });
    },

    // to show Miscellaneous Fees page for admin side
    getAfeeMisc: function (req, res) {
        res.render('a_fees_misc', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Miscellaneous Fees'
        });
    },

    // to show Other Fees page for admin side
    getAfeeOthers: function (req, res) {
        res.render('a_fees_other', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Other Fees'
        });
    },

    // to show Tuition Fees page for admin side
    getAfeeTuition: function (req, res) {
        res.render('a_fees_tuition', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Tuition Fees',
        });
    },

    getAfeeManage: async function (req, res) {
        var fees = await feesModel.aggregate(
            [{
                '$match': {
                    'schoolYear': req.session.userSettings.schoolYear
                }
            }, {
                '$lookup': {
                    'from': 'sections',
                    'localField': 'sectionID',
                    'foreignField': 'sectionID',
                    'as': 'secDta'
                }
            }, {
                '$unwind': {
                    'path': '$secDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'ref_section',
                    'localField': 'secDta.sectionName',
                    'foreignField': 'sectionName',
                    'as': 'refSec'
                }
            }, {
                '$match': {
                    'refSec.gradeLvl': req.session.userSettings.gradeLvl
                }
            }, {
                '$project': {
                    '_id': 0,
                    'tuition': 1,
                    'misc': 1,
                    'additional': 1,
                    'other': 1
                }
            }]
        );
        var schoolYear = await schoolYearModel.aggregate( //get school years in database for display in dropdown element
            [{
                '$project': {
                    'value': '$schoolYear',
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
        res.render('a_fees_Manage', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Manage Fees',
            schoolYear: schoolYear,
            SYSettings: req.session.userSettings.schoolYear,
            gradeLvl: gradeLvl,
            GLSettings: req.session.userSettings.gradeLvl,
            fees: fees[0],
        });
    },

    postEditFees: async function (req, res) {
        try {
            var fees = await feesModel.aggregate(
                [{
                    '$match': {
                        'schoolYear': req.session.userSettings.schoolYear
                    }
                }, {
                    '$lookup': {
                        'from': 'sections',
                        'localField': 'sectionID',
                        'foreignField': 'sectionID',
                        'as': 'secDta'
                    }
                }, {
                    '$unwind': {
                        'path': '$secDta',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$lookup': {
                        'from': 'ref_section',
                        'localField': 'secDta.sectionName',
                        'foreignField': 'sectionName',
                        'as': 'refSec'
                    }
                }, {
                    '$match': {
                        'refSec.gradeLvl': req.session.userSettings.gradeLvl
                    }
                }]
            );
            var feeDta = req.body.fees;
            await feesModel.findOneAndUpdate({
                sectionID: fees[0].sectionID
            }, {
                tuition: feeDta.tuition,
                additional: feeDta.additional,
                misc: feeDta.misc,
                other: feeDta.other
            }, {
                useFindAndModify: false
            });
            res.send({
                status: 200,
                msg: 'Fees recorded'
            });
        } catch (e) {
            console.log(e); //for debug purposes 
            res.send({
                status: 500,
                msg: 'An error has occured'
            });
        }


    },

    // to show Upon Enrollment page for admin side
    getAfeeUponE: async function (req, res) {
        var schoolYear = await schoolYearModel.aggregate( //get school years in database for display in dropdown element
            [{
                '$project': {
                    'value': '$schoolYear',
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
        var enroll = await upon_enrollmentModel.aggregate(
            [{
                '$match': {
                    'schoolYear': req.session.userSettings.schoolYear
                }
            }, {
                '$lookup': {
                    'from': 'sections',
                    'localField': 'sectionID',
                    'foreignField': 'sectionID',
                    'as': 'secDta'
                }
            }, {
                '$unwind': {
                    'path': '$secDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'ref_section',
                    'localField': 'secDta.sectionName',
                    'foreignField': 'sectionName',
                    'as': 'refSec'
                }
            }, {
                '$match': {
                    'refSec.gradeLvl': req.session.userSettings.gradeLvl
                }
            }, {
                '$project': {
                    '_id': 0,
                    'fullPayment': 1,
                    'semestralPayment': 1,
                    'trimestralPayment': 1,
                    'monthlyPayment': 1,
                    'quarterlyPayment': 1
                }
            }]
        );
        res.render('a_fees_uponE', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Edit Upon Enrollment',
            schoolYear: schoolYear,
            SYSettings: req.session.userSettings.schoolYear,
            gradeLvl: gradeLvl,
            GLSettings: req.session.userSettings.gradeLvl,
            enroll: enroll[0],
        });
    },

    postEditUponE: async function (req, res) {
        try {
            var ueID = await upon_enrollmentModel.aggregate([{
                '$match': {
                    'schoolYear': '2020-2021'
                }
            }, {
                '$lookup': {
                    'from': 'sections',
                    'localField': 'sectionID',
                    'foreignField': 'sectionID',
                    'as': 'secDta'
                }
            }, {
                '$unwind': {
                    'path': '$secDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'ref_section',
                    'localField': 'secDta.sectionName',
                    'foreignField': 'sectionName',
                    'as': 'refSec'
                }
            }, {
                '$match': {
                    'refSec.gradeLvl': 'Grade 1'
                }
            }]);

            var ueDta = req.body.ue;
            await upon_enrollmentModel.findOneAndUpdate({
                sectionID: ueID[0].sectionID
            }, {
                fullPayment: ueDta.full,
                semestralPayment: ueDta.sem,
                trimestralPayment: ueDta.tri,
                quarterlyPayment: ueDta.qtr,
                monthlyPayment: ueDta.mon
            }, {
                useFindAndModify: false
            });
            res.send({
                status: 200,
                msg: 'Upon Enrollment Payments recorded'
            });
        } catch (e) {
            console.log(e); //for debug purposes 
            res.send({
                status: 500,
                msg: 'An error has occured'
            });
        }
    },
    // to show the interface to add classes for admin side
    getAschedAddClasses: async function (req, res) {
        var subject = await subjectModel.aggregate(
            [{
                '$project': {
                    '_id': 0,
                    'value': '$subjectCode',
                    'name': '$subjectName'
                }
            }]
        );
        var section = await sectionModel.aggregate(
            [{
                '$match': {
                    'schoolYear': await getCurrentSY()
                }
            }, {
                '$project': {
                    '_id': 0,
                    'value': '$sectionID',
                    'name': '$sectionName'
                }
            }]
        );
        var teacher = await teacherModel.aggregate(
            [{
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
                    '_id': 0,
                    'value': '$userID',
                    'name1': '$userData.firstName',
                    'name2': '$userData.middleName',
                    'name3': '$userData.lastName'
                }
            }]
        );
        res.render('a_sched_AddClasses', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Add Classes',
            subject: subject,
            section: section,
            teacher: teacher,
        });
    },
    getAschedViewClasses: async function (req, res) {
        var schoolYear = await classModel.aggregate( //get school years in database with available classes
            [{
                '$lookup': {
                    'from': 'sections',
                    'localField': 'sectionID',
                    'foreignField': 'sectionID',
                    'as': 'secDta'
                }
            }, {
                '$unwind': {
                    'path': '$secDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$group': {
                    '_id': '$secDta.schoolYear'
                }
            }, {
                '$project': {
                    '_id': 0,
                    'value': '$_id'
                }
            }]
        );
        var list = await getClassList(req.session.userSettings.schoolYear);
        res.render('a_sched_ViewClasses', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'View Classes',
            schoolYear: schoolYear,
            SYSettings: req.session.userSettings.schoolYear,
            list: list,
        });
    },

    // to show the set school year page for admin side
    getAschedCurSchoolYr: function (req, res) {
        res.render('a_sched_CurSchoolYr', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Set CUrrent School Year',
        });
    },

    // to show the class schedule page for admin side
    getAschedClassSched: function (req, res) {
        res.render('a_sched_classSched', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Class Schedules',
        });
    },

    // to show the add class schedule page for admin side
    getAschednewClassSched: function (req, res) {
        res.render('a_sched_newClassSched', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'New Class Schedules',
        });
    },

    // to show the academic calendar page for admin side
    getAschedAcadCalendar: function (req, res) {
        res.render('a_sched_acadCalendar', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Academic Calendar',
        });
    },

    //function to show outstanding balance report form
    getAReportBalance: async function (req, res) {
        var schoolYear = await schoolYearModel.aggregate( //get school years in database for display in dropdown element
            [{
                '$project': {
                    'value': '$schoolYear',
                    'selected': '$isCurrent'
                }
            }]
        );
        res.render('a_report_OutstandingBalForm', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: "Outstanding Balance Report",
            schoolYear: schoolYear
        })
    },

    getAReportBalanceTable: async function (req, res) {
        var schoolYear = req.session.reportschoolYear;
        var reportData = await getBalanceReportData(schoolYear);
        console.log(reportData);
        res.render('a_report_OutstandingBalTable', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: "Outstanding Balance Report",
            schoolYear: schoolYear,
            reportData: reportData
        })
    },

    getAreportPaymentsReport: async function (req, res) {
        var schoolYears = await schoolYearModel.aggregate( //get school years in database for display in dropdown element
            [{
                '$project': {
                    'value': '$schoolYear',
                }
            }]
        );
        var schoolYear = req.session.userSettings.schoolYear;
     
        var sectionReport = await getSectionReport(schoolYear);
        var bankReportTotal = await getBankReportTotal(schoolYear);
        var ccReportTotal = await getCCReportTotal(schoolYear);
        var paymentReportTotal = await getPaymentReportTotal(schoolYear);

        var totals = {
            brt: bankReportTotal,
            crt: ccReportTotal,
            prt: paymentReportTotal
        }

        // console.log(totals);
        res.render('a_report_paymentsReport', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Payment Report',
            schoolYear:schoolYears,
            SYSettings: req.session.userSettings.schoolYear,
            sectionReport: sectionReport,
            total:totals
        });

    },
    // function to approve student enrollment
    postEnrollmentApproved: async function (req, res) {
        var {
            id
        } = req.body;
        //find by id then update remark from FA to E
        try {
            await studentMembersModel.findOneAndUpdate({
                studentID: id
            }, {
                remarks: 'E'
            }, {
                useFindAndModify: false
            });
            res.send({
                status: 200,
                msg: 'Enrollment Approved'
            });
        } catch (e) {
            console.log(e); //for debug purposes 
            res.send({
                status: 500,
                msg: 'An error has occured'
            });
        }
    },

    // function to approve student enrollment
    postEnrollmentRejected: async function (req, res) {
        var {
            id
        } = req.body;
        //find by id then update remark from FA to E
        try {
            await studentMembersModel.findOneAndUpdate({
                studentID: id
            }, {
                remarks: 'D'
            }, {
                useFindAndModify: false
            });
            res.send({
                status: 200,
                msg: 'Enrollment Denied'
            });
        } catch (e) {
            console.log(e); //for debug purposes 
            res.send({
                status: 500,
                msg: 'An error has occured'
            });
        }
    },
    // to show the new event page for admin side
    getAschednewAcadCalendar: function (req, res) {
        try {
            res.render('a_sched_newAcadCalendar', {
                firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
                title: 'New Event',
            });
        } catch (e) {
            console.log(e);
        }
    },

    // to post the new event to the system
    postNewAcadCalendar: async function (req, res) {
        if (req.session.logUser) {
            let {
                eventName,
                eventDate
            } = req.body;
            var eventID = await getMinMaxEventID(-1, 1);
            var schoolYear = await getCurrentSY();

            var event = new Event(eventID, eventName, eventDate, schoolYear);
            var newEvent = new eventModel(event);

            newEvent.recordNewEvent();

            res.send({
                status: 201,
                msg: 'Event Recorded'
            });
        } else {
            res.send({
                status: 500,
                msg: ': User is not logged in'
            });
        }
    },

    // to show the edit event page for admin side
    getAschededitAcadCalendar: function (req, res) {
        res.render('a_sched_editAcadCalendar', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Edit Event',
        });
    },



    // to show all admins for admin side
    getAuserAdmin: async function (req, res) {
        var matches = await userModel.aggregate([{
            '$match': {
                'type': 'A'
            }
        }, {
            '$lookup': {
                'from': 'admins',
                'localField': 'userID',
                'foreignField': 'userID',
                'as': 'admin'
            }
        }, {
            '$unwind': {
                'path': '$admin',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                'userID': 1,
                'firstName': 1,
                'lastName': 1,
                'middleName': 1,
                'type': 1,
                'gender': 1,
                'dateCreated': '$admin.dateCreated'
            }
        }]);
        res.render('a_users_admins', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Admins',
            admins: matches
        });
    },

    // to show the profile of an admin for admin side
    getAuserAProf: function (req, res) {
        res.render('a_users_AProfile', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Admin Profile',
        });
    },

    // to show all accounts of all of the parent's children for admin side
    getAuserPAcc: function (req, res) {
        res.render('a_users_PAccount', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Parent Account',
        });
    },

    // to show all of the parents for admin side
    getAuserParent: async function (req, res) {
        var matches = await userModel.aggregate([{
            '$match': {
                'type': 'P'
            }
        }, {
            '$lookup': {
                'from': 'parents',
                'localField': 'userID',
                'foreignField': 'userID',
                'as': 'parent'
            }
        }, {
            '$unwind': {
                'path': '$parent',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                'userID': 1,
                'firstName': 1,
                'lastName': 1,
                'middleName': 1,
                'type': 1,
                'gender': 1
            }
        }]);
        res.render('a_users_parents', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Parents',
            parents: matches
        });
    },

    //to show the profile of a parent for admin side 
    getAuserPProf: function (req, res) {
        res.render('a_users_PProfile', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Parent Profile',
        });
    },

    // to show a students account for admin side
    getAuserSAcc: async function (req, res) {
        var studentID = req.params.userID;
        var schoolYear = await getStudentSY(studentID);
        var studentinfo = await studentModel.aggregate(
            [{
                '$match': {
                    'userID': studentID
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userID',
                    'foreignField': 'userID',
                    'as': 'usrDta'
                }
            }, {
                '$unwind': {
                    'path': '$usrDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'studentMembers',
                    'localField': 'userID',
                    'foreignField': 'studentID',
                    'as': 'mbrDta'
                }
            }, {
                '$unwind': {
                    'path': '$mbrDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'sections',
                    'localField': 'mbrDta.sectionID',
                    'foreignField': 'sectionID',
                    'as': 'secDta'
                }
            }, {
                '$match': {
                    'secDta.schoolYear': req.session.userSettings.schoolYear
                }
            }, {
                '$lookup': {
                    'from': 'upon_enrollment',
                    'localField': 'mbrDta.sectionID',
                    'foreignField': 'sectionID',
                    'as': 'erlDta'
                }
            }, {
                '$unwind': {
                    'path': '$erlDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$unwind': {
                    'path': '$secDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'ref_section',
                    'localField': 'secDta.sectionName',
                    'foreignField': 'sectionName',
                    'as': 'refSec'
                }
            }, {
                '$unwind': {
                    'path': '$refSec',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'payments',
                    'localField': 'userID',
                    'foreignField': 'studentID',
                    'as': 'pmtDta'
                }
            }, {
                '$unwind': {
                    'path': '$pmtDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$match': {
                    '$expr': {
                        '$eq': [
                            '$pmtDta.sectionID', '$mbrDta.sectionID'
                        ]
                    }
                }
            }, {
                '$project': {
                    '_id': 0,
                    'schoolYear': '$secDta.schoolYear',
                    'gradeLvl': '$refSec.gradeLvl',
                    'userID': 1,
                    'name': {
                        '$concat': [
                            '$usrDta.firstName', ' ', '$usrDta.middleName', ' ', '$usrDta.lastName'
                        ]
                    },
                    'pmtType': '$pmtDta.paymentPlan',
                    'begBal': '$erlDta.fullPayment',
                    'secID': '$mbrDta.sectionID'
                }
            }]
        );
        var paidAmt = await getStudentPaymentsSummary(studentinfo[0].userID, studentinfo[0].secID);
        var remBal = studentinfo[0].begBal - paidAmt[0].totalAmountPaid;
        var transHistPmt = await studentModel.aggregate(
            [{
                '$match': {
                    //get only the relevant user
                    'userID': studentinfo[0].userID
                }
            }, {
                '$lookup': {
                    'from': 'payments',
                    'localField': 'userID',
                    'foreignField': 'studentID',
                    'as': 'pmtDta'
                }
            }, {
                '$unwind': {
                    'path': '$pmtDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$match': {
                    //get only the relevant section
                    'pmtDta.sectionID': studentinfo[0].secID
                }
            }, {
                '$lookup': {
                    'from': 'cc_payment',
                    'localField': 'pmtDta.paymentID',
                    'foreignField': 'paymentID',
                    'as': 'ccDta'
                }
            }, {
                '$unwind': {
                    'path': '$ccDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'bank_payment',
                    'localField': 'pmtDta.paymentID',
                    'foreignField': 'paymentID',
                    'as': 'bnkDta'
                }
            }, {
                '$unwind': {
                    'path': '$bnkDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'pmtMtd': {
                        '$switch': {
                            //converts either cctype(cc) or accountNumber(bank) to boolean then if null(doesnt exist) pmtMtd field gets null otherwise gets either cctype or accountNumber
                            'branches': [{
                                'case': {
                                    '$toBool': [
                                        '$ccDta.ccType'
                                    ]
                                },
                                'then': '$ccDta.ccType'
                            }, {
                                'case': {
                                    '$toBool': [
                                        '$bnkDta.accountNumber'
                                    ]
                                },
                                'then': '$bnkDta.accountNumber'
                            }],
                            'default': null
                        }
                    },
                    'dtPaid': '$pmtDta.datePaid',
                    'pmtID': '$pmtDta.paymentID',
                    'amt': '$pmtDta.amountPaid'
                }
            }]
        );
        res.render('a_users_SAccount', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student Account',
            schoolYear: schoolYear,
            SYSettings: req.session.userSettings.schoolYear,
            info: studentinfo[0],
            paidAmt: paidAmt[0].totalAmountPaid,
            remBal: remBal,
            histPmt: transHistPmt,
        });
    },

    // to show page for sending a student an email for admin side
    getAuserSEmail: function (req, res) {
        res.render('a_users_SEmail', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Send Email',
        });
    },

    // to show a students profile for admin side
    getAuserSProf: async function (req, res) {
        var userID = req.params.userID;
        var schoolYear = req.params.schoolYear;
        var studentProfile = await getSProfile(userID, schoolYear);
        var student = await userModel.findOne({
            userID: userID
        });
        res.render('a_users_SProfile', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student Profile',
            studentID: userID,
            student: student,
            profile: studentProfile,
        });
    },

    // to show a list of teachers for admin side
    getAuserTeachers: async function (req, res) {
        var matches = await userModel.aggregate([{
            '$match': {
                'type': 'T'
            }
        }, {
            '$lookup': {
                'from': 'teachers',
                'localField': 'userID',
                'foreignField': 'userID',
                'as': 'teacher'
            }
        }, {
            '$unwind': {
                'path': '$teacher',
                'preserveNullAndEmptyArrays': true
            }
        }, {
            '$project': {
                'userID': 1,
                'firstName': 1,
                'lastName': 1,
                'middleName': 1,
                'type': 1,
                'gender': 1,
                'dateCreated': '$teacher.dateCreated'
            }
        }]);
        res.render('a_users_teachers', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Teachers',
            teachers: matches
        });
    },

    // to show the teachers profile page for admin side
    getAuserTProf: function (req, res) {
        res.render('a_users_TProfile', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Teacher Profile',
        });
    },

    // to show the edit teachers page for admin side
    getAusereditTeachers: function (req, res) {
        res.render('a_users_editT', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Edit Teacher',
        });
    },

    postAddClass: async function (req, res) {
        var {
            sub,
            sec,
            tch
        } = req.body;
        var cid = await getNextClassID();

        var classData = new Class(cid, tch, sec, sub);
        var newClass = new classModel(classData);
        await newClass.recordNewClass();
        res.send({
            status: 200,
            msg: 'Class has been recorded'
        });
    },

    postOutstandingBalReport: async function (req, res) {
        var schoolYear = req.body.schoolYear;
        try {
            req.session.reportschoolYear = schoolYear;
            res.send({
                status: 201
            });
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            })
        }


    },

    /* 
        TEACHER FUCNTIONS
    */

    // to show the students from the teachers side
    getTschedacadCalendar: function (req, res) {
        res.render('t_sched_acadCalendar', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Academic Calendar'
        });
    },

    // to show the students from the teachers side
    getTschedacadCalendar2: function (req, res) {
        res.render('t_sched_acadCalendar2', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Academic Calendar'
        });
    },

    // to show the students from the teachers side
    getTschedclassSched: function (req, res) {
        res.render('t_sched_classSched', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Teacher Schedule'
        });
    },

    // to show the students from the teachers side
    getTuserSgrades: function (req, res) {
        res.render('t_users_SGrades', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Students grades'
        });
    },

    // to show the students profile from the teachers side
    getTuserSProf: async function (req, res) {
        var userID = req.params.userID;
        var schoolYear = req.params.schoolYear;
        var studentProfile = await getSProfile(userID, schoolYear);
        var student = await userModel.findOne({
            userID: userID
        });
        res.render('t_users_SProfile', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student profile',
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student Profile',
            studentID: userID,
            student: student,
            profile: studentProfile,
        });
    },

    // to show the students from the teachers side
    // 
    getTuserStudents: async function (req, res) {
        // var schoolYear = 
        // var classes = await getClassList()
        var schoolYear = await schoolYearModel.aggregate( //get school years in database for display in dropdown element
            [{
                '$project': {
                    'value': '$schoolYear',
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
        var students = await getStudentListSYGL(req.session.userSettings.schoolYear, req.session.userSettings.gradeLvl);

        res.render('t_users_students', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Students',
            schoolYear: schoolYear,
            SYSettings: req.session.userSettings.schoolYear,
            gradeLvl: gradeLvl,
            GLSettings: req.session.userSettings.gradeLvl,
            student: students

        });
    },

    /*
        PARENT FUNCTIONS
    */
    // to show paying for enrollment (bank) from the parents side
    getPpaybank: function (req, res) {
        res.render('p_pay_bank', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Payment'
        });
    },

    // to show selecting of payment plan for enrollment (bank) from the parents side
    getPpayBPlan: function (req, res) {
        res.render('p_pay_BPlan', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Payment'
        });
    },

    // to show paying for enrollment (credit card) from the parents side
    getPpaycc: function (req, res) {
        var amountDue = req.session.amountDue;
        //console.log(amountDue);
        res.render('p_pay_cc', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Payment',
            amountDue: amountDue
        });
    },

    // to show selecting of payment plan for enrollment (credit card) from the parents side
    getPpayCCPlan: async function (req, res) {
        var parentID = req.session.logUser.userID;
        try {
            var studentList = await getStudentListParentID(parentID);
            console.log(studentList);
            console.log("HELLO WORLD!");
            console.log(studentList[0].gradeLvl);
            if (studentList)
                res.render('p_pay_CCPlan', {
                    firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
                    title: 'Credit Card Payment',
                    student: studentList
                });
            else
                res.render('error', {
                    title: 'Error',
                    msg: 'something went wrong'
                });
        } catch (e) {
            console.log(e);
        }
    },

    getPpayCCOTP: async function (req, res) {
        res.render('p_pay_CCOTP', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Confirm Payment',
            amountDue: req.session.amountDue
        })
    },
    // to show the breakdown of details from the parents side
    getPaccEChild: async function (req, res) {
        var parentID = req.session.logUser.userID;
        try {
            var studentList = await getStudentListParentID(parentID);
            if (studentList)
                res.render('p_acc_enrollChild', {
                    firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
                    title: 'Enroll Child',
                    student: studentList
                });
            else
                res.render('error', {
                    title: 'Error',
                    msg: 'something went wrong'
                });
        } catch (e) {
            console.log(e);
        }
    },

    getPaccSGrades: function (req, res) {
        try{
            res.render('p_acc_grades', {
                firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
                title: 'Student Grades'
            });
        }catch(e){
            console.log(e);
        } 
    },

    // to show the Statement of Accounts from the parents side
    getPtransSA: async function (req, res) {
        var studentID = req.session.userSettings.studentID;
        var schoolYear = await getStudentSY(studentID);
        var studentinfo = await studentModel.aggregate(
            [{
                '$match': {
                    'userID': studentID
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'userID',
                    'foreignField': 'userID',
                    'as': 'usrDta'
                }
            }, {
                '$unwind': {
                    'path': '$usrDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'studentMembers',
                    'localField': 'userID',
                    'foreignField': 'studentID',
                    'as': 'mbrDta'
                }
            }, {
                '$unwind': {
                    'path': '$mbrDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'sections',
                    'localField': 'mbrDta.sectionID',
                    'foreignField': 'sectionID',
                    'as': 'secDta'
                }
            }, {
                '$match': {
                    'secDta.schoolYear': req.session.userSettings.schoolYear
                }
            }, {
                '$lookup': {
                    'from': 'upon_enrollment',
                    'localField': 'mbrDta.sectionID',
                    'foreignField': 'sectionID',
                    'as': 'erlDta'
                }
            }, {
                '$unwind': {
                    'path': '$erlDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$unwind': {
                    'path': '$secDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'ref_section',
                    'localField': 'secDta.sectionName',
                    'foreignField': 'sectionName',
                    'as': 'refSec'
                }
            }, {
                '$unwind': {
                    'path': '$refSec',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'payments',
                    'localField': 'userID',
                    'foreignField': 'studentID',
                    'as': 'pmtDta'
                }
            }, {
                '$unwind': {
                    'path': '$pmtDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$match': {
                    '$expr': {
                        '$eq': [
                            '$pmtDta.sectionID', '$mbrDta.sectionID'
                        ]
                    }
                }
            }, {
                '$project': {
                    '_id': 0,
                    'schoolYear': '$secDta.schoolYear',
                    'gradeLvl': '$refSec.gradeLvl',
                    'userID': 1,
                    'name': {
                        '$concat': [
                            '$usrDta.firstName', ' ', '$usrDta.middleName', ' ', '$usrDta.lastName'
                        ]
                    },
                    'pmtType': '$pmtDta.paymentPlan',
                    'begBal': '$erlDta.fullPayment',
                    'secID': '$mbrDta.sectionID'
                }
            }]
        );
        var paidAmt = await getStudentPaymentsSummary(studentinfo[0].userID, studentinfo[0].secID);
        var remBal = studentinfo[0].begBal - paidAmt[0].totalAmountPaid;
        var studentList = await getParentChildren(req.session.logUser.userID);
        var transHistPmt = await studentModel.aggregate(
            [{
                '$match': {
                    //get only the relevant user
                    'userID': studentinfo[0].userID
                }
            }, {
                '$lookup': {
                    'from': 'payments',
                    'localField': 'userID',
                    'foreignField': 'studentID',
                    'as': 'pmtDta'
                }
            }, {
                '$unwind': {
                    'path': '$pmtDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$match': {
                    //get only the relevant section
                    'pmtDta.sectionID': studentinfo[0].secID
                }
            }, {
                '$lookup': {
                    'from': 'cc_payment',
                    'localField': 'pmtDta.paymentID',
                    'foreignField': 'paymentID',
                    'as': 'ccDta'
                }
            }, {
                '$unwind': {
                    'path': '$ccDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$lookup': {
                    'from': 'bank_payment',
                    'localField': 'pmtDta.paymentID',
                    'foreignField': 'paymentID',
                    'as': 'bnkDta'
                }
            }, {
                '$unwind': {
                    'path': '$bnkDta',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$project': {
                    'pmtMtd': {
                        '$switch': {
                            //converts either cctype(cc) or accountNumber(bank) to boolean then if null(doesnt exist) pmtMtd field gets null otherwise gets either cctype or accountNumber
                            'branches': [{
                                'case': {
                                    '$toBool': [
                                        '$ccDta.ccType'
                                    ]
                                },
                                'then': '$ccDta.ccType'
                            }, {
                                'case': {
                                    '$toBool': [
                                        '$bnkDta.accountNumber'
                                    ]
                                },
                                'then': '$bnkDta.accountNumber'
                            }],
                            'default': null
                        }
                    },
                    'dtPaid': '$pmtDta.datePaid',
                    'pmtID': '$pmtDta.paymentID',
                    'amt': '$pmtDta.amountPaid'
                }
            }]
        );
        console.log(studentList);
        res.render('p_trans_SA', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Statement of Accounts',
            schoolYear: schoolYear,
            SYSettings: req.session.userSettings.schoolYear,
            info: studentinfo[0],
            paidAmt: paidAmt[0].totalAmountPaid,
            remBal: remBal,
            histPmt: transHistPmt,
            studentID: studentList,
            SIDSettings: studentinfo[0].name,
        });
    },

    getPaccNewChild: function (req, res) {
        res.render('p_acc_NChild', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Register new Child'
        });
    },

    getPpaybank: function (req, res) {
        var amountDue = req.session.amountDue;
        res.render('p_pay_bank', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Bank Statement',
            amountDue: amountDue
        });
    },

    getPpayBankPlan: async function (req, res) {
        var parentID = req.session.logUser.userID;
        try {
            var studentList = await getStudentListParentID(parentID);
            console.log(studentList);
            if (studentList)
                res.render('p_pay_BPlan', {
                    firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
                    title: 'Bank Payment',
                    student: studentList
                });
            else
                res.render('error', {
                    title: 'Error',
                    msg: 'something went wrong'
                });
        } catch (e) {
            console.log(e);
        }
    },

    getPschedacadCalendar: function (req, res) {
        res.render('p_sched_acadCalendar', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Academic Calendar'
        });
    },

    getPschedacadCalendar2: function (req, res) {
        res.render('p_sched_acadCalendar2', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Academic Calendar'
        });
    },

    getPschedclassSched: function (req, res) {
        res.render('p_sched_classSched', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student Schedule'
        });
    },

    getPtransBD: function (req, res) {
        res.render('p_trans_BD', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Breakdown Details'
        });
    },

    postEnrollmentOld: async function (req, res) {
        var studentID = req.body.studentID;
        try {
            var i = 0;
            var valid = true;
            var sections = await getCurrentSections();
            var studentMembers = await getStudentMembership(studentID);

            while (valid && i < sections.length) {
                if (studentMembers[0].sectionID == sections[i].sectionID)
                    valid = false;
                i++;
            }

            if (valid) {
                var nextSectionID = await getNextSectionEnrollment(studentMembers[0].sectionID, studentMembers[0].remarks);
                var sectionMemberData = new sectionMembers(nextSectionID, studentID, 'E');
                var newSectionMember = new sectionMemberModel(sectionMemberData);
                var sectionMemberResult = await newSectionMember.recordNewSectionMember();
                if (sectionMemberResult) {
                    res.send({
                        status: 201
                    });
                } else {
                    res.send({
                        status: 401,
                        msg: 'There is an error when adding student to section'
                    });
                }
            } else
                res.send({
                    status: 401,
                    msg: "Student is already enrolled"
                });
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
        }
    },

    /*
        This function checks if the student can pay, it also gets the required
        amount to pay based on the payment plan chosen for the credit card
    */
    postPpayCCPlan: async function (req, res) {
        var {
            studentID,
            paymentPlan
        } = req.body;
        try {
            var i = 0;
            var enrolled = false;

            var sections = await getCurrentSections();
            var studentMembers = await getStudentMembership(studentID);

            //checks if student has enrolled this school year
            while (!enrolled && i < sections.length) {
                if (studentMembers[0].sectionID == sections[i].sectionID)
                    enrolled = true;
                i++;
            }

            if (enrolled) {
                if (studentMembers[0].remarks == "FA")
                    res.send({
                        status: 401,
                        msg: 'Student is not yet allowed to pay\nPlease wait for admin approval'
                    });
                else if (studentMembers[0].remarks == "D")
                    res.send({
                        status: 401,
                        msg: 'Student has been rejected. You are not eligible to pay.'
                    });

                var amountDue = await getAmountOwed(studentID, studentMembers[0].sectionID, paymentPlan);
                console.log(amountDue);
                switch (amountDue) {
                    case -1:
                        res.send({
                            status: 401,
                            msg: 'Student is already fully paid'
                        });
                        break;
                    case -2:
                        res.send({
                            status: 401,
                            msg: 'User has not chosen a payment plan\nPlease select a payment plan before you continue'
                        });
                        break;
                    case -3:
                        res.send({
                            status: 401,
                            msg: 'User has already chosen a payment plan\n Select Next Installment or Remaining Balance to contiue'
                        });
                        break;
                    default:
                        console.log(amountDue);
                        console.log(studentID);

                        req.session.studentID = studentID;
                        req.session.amountDue = amountDue;
                        req.session.paymentPlan = paymentPlan;
                        req.session.sectionID = studentMembers[0].sectionID;
                        console.log(req.session);

                        res.send({
                            status: 201
                        });
                }
                // res.send({status:401, msg:'Student is enrolled'});
            } else {
                res.send({
                    status: 401,
                    msg: 'Student is not yet enrolled'
                })
            }
        } catch (e) {
            console.log(e);
            //res.send({status:500,msg: e});
        }
    },

    // This function saves data from CCInfo page to session, to be used after approval of OTP
    postPpayCCInfo: async function (req, res) {
        var {
            ccHolderName,
            ccNo,
            ccExp,
            ccType
        } = req.body;

        try {
            req.session.ccHolderName = ccHolderName;
            req.session.ccNo = ccNo;
            req.session.ccExp = ccExp;
            req.session.ccType = ccType;
            var OTP = Math.random().toString().slice(2, 10);;
            req.session.otp = OTP;
            res.send({
                status: 201,
                otp: OTP
            });
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
        }
    },

    /**
     *      This function is used to post the payment information once otp is confirmed to match
     */

    postPpayCCOTP: async function (req, res) {
        var otp = req.body.otp;
        try {
            if (otp != req.session.otp)
                res.send({
                    status: 401,
                    msg: 'OTP does not match'
                });
            else {
                var sectionID = req.session.sectionID;
                var paymentID = await getNextPaymentID();
                var paymentPlan = renamePaymentPlan(req.session.paymentPlan);

                var paymentData = new Payment(paymentID, req.session.amountDue, new Date(), paymentPlan, req.session.studentID, sectionID);
                var newPayment = new paymentModel(paymentData);
                var paymentResult = await newPayment.recordNewPayment();


                if (paymentResult) {
                    var cc_payment = new CC_Payment(paymentID, req.session.ccType, req.session.ccExp, req.session.ccHolderName);
                    var newcc_payment = new cc_paymentModel(cc_payment);
                    var newcc_paymentResult = await newcc_payment.recordNewCCPayment();
                    if (newcc_paymentResult)
                        res.send({
                            status: 201
                        });
                    else
                        res.send({
                            status: 401,
                            msg: 'There is an error when payment'
                        });
                } else {
                    res.send({
                        status: 401,
                        msg: 'There is an error when payment'
                    });
                }
            }
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
        }
    },

    // this function is used to post bank payments

    postPpayBank: async function (req, res) {
        var {
            accountNumber,
            accountName
        } = req.body;
        accountNumber = parseInt(accountNumber);
        try {
            var paymentID = await getNextPaymentID();
            var sectionID = req.session.sectionID;
            var paymentPlan = renamePaymentPlan(req.session.paymentPlan);

            var paymentData = new Payment(paymentID, req.session.amountDue, new Date(), paymentPlan, req.session.studentID, sectionID);
            var newPayment = new paymentModel(paymentData);
            var paymentResult = await newPayment.recordNewPayment();

            if (paymentResult) {
                var bank_payment = new Bank_Payment(paymentID, accountName, accountNumber);
                var newbank_payment = new bank_paymentModel(bank_payment);
                var newbank_paymentResult = await newbank_payment.recordNewBankPayment();
                if (newbank_paymentResult)
                    res.send({
                        status: 201
                    });
                else
                    res.send({
                        status: 401,
                        msg: 'There is an error when adding payment'
                    });
            } else {
                res.send({
                    status: 401,
                    msg: 'There is an error when adding payment'
                });
            }
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
        }
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
        //for testing purposes
        // req.session.studentID = '20-000023';
        console.log(req.session);
        res.render('s_enroll_parent', {
            title: 'Register Parent'
        });
    },

    // getEnrollemtOld: async function (req, res) {
    //     var oldStudent = await get
    // }

    getSaccgrades: function (req, res) {
        res.render('s_acc_grades', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student Grades'
        });
    },

    getEnrollemtOld: function (req, res) {
        res.render('s_enroll_old', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Update Personal Information'
        });
    },

    getSschedacadCalendar: function (req, res) {
        res.render('s_sched_acadCalendar', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Academic Calendar'
        });
    },

    getSschedacadCalendar2: function (req, res) {
        res.render('s_sched_acadCalendar2', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Academic Calendar'
        });
    },

    getSschedclassSched: function (req, res) {
        res.render('s_sched_classSched', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Student Schedule'
        });
    },

    getStransBD: function (req, res) {
        res.render('s_trans_BD', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Breakdown details'
        });
    },

    getStransSA: function (req, res) {
        res.render('s_trans_SA', {
            firstname: req.session.logUser.firstName,
            middlename: req.session.logUser.middleName,
            lastname: req.session.logUser.lastName,
            title: 'Statement of Account'
        });
    },

    // Function is used to create new students
    postEnrollmentNew: async function (req, res) {
        var {
            userInfo,
            studentDetail,
            studentData,
            sectionID
        } = req.body;
        try {
            console.log(userInfo);
            console.log(studentDetail);
            console.log(studentData);

            var userID = await getNextStudentID();
            var password = generator.generate({
                length: 12,
                numbers: true
            });
            console.log(password)
            var hash = await bcrypt.hash(password, saltRounds)

            // create user
            var user = new User(userID, hash, userInfo.firstName, userInfo.lastName, userInfo.middleName, 'S', userInfo.gender);
            var newUser = new userModel(user);
            var userResult = await newUser.recordNewUser();
            // console.log(userResult);
            //create student
            if (userResult) {
                var student = new Student(userID, studentData.mobileNum, studentData.teleNum, studentData.nationality,
                    studentData.birthDate, studentData.birthPlace, studentData.email, studentData.religion,
                    studentData.address);
                // console.log(student);
                var newStudent = new studentModel(student);
                var studentResult = await newStudent.recordNewStudent();
                // console.log(studentResult);

                // create student details
                // reminder to self, add siblings and education background
                if (studentResult) {
                    var studentDetailsData = new studentDetails(userID, studentDetail.familyRecords, studentDetail.reason);
                    var newStudentDetails = new studentDetailsModel(studentDetailsData);
                    var studentDetailsResult = await newStudentDetails.recordNewStudentDetails();

                    var sectionMemberData = new sectionMembers(sectionID, userID, 'FA');
                    console.log(sectionMemberData);
                    var newSectionMember = new sectionMemberModel(sectionMemberData);
                    var sectionMemberResult = await newSectionMember.recordNewSectionMember();
                    console.log(sectionMemberResult)
                    if (studentDetailsResult && sectionMemberResult) {
                        req.session.studentID = userID;
                        console.log(req.session);
                        res.send({
                            status: 201,
                            userID: userID,
                            password: password
                        })
                    } else {
                        res.send({
                            status: 401,
                            msg: 'There is an error when adding user'
                        });
                    }
                } else {
                    res.send({
                        status: 401,
                        msg: 'There is an error when adding user'
                    })
                }
            } else {
                res.send({
                    status: 401,
                    msg: 'There is an error when adding user'
                })
            }
            res.send({
                status: 500,
                msg: 'Something went Wrong'
            });
        } catch (e) {
            //res.send({status : 500, msg : e});
            console.log('It entered the catch');
        }
    },

    postEnrollParentOld: async function (req, res) {

        try {
            var parentID = req.body.parentInfo.parentID;
            var studentID = req.session.studentID;
            console.log(parentID);
            var result = await assignParent(parentID, studentID);

            if (result)
                res.send({
                    status: 201
                });
            else {
                res.send({
                    status: 401,
                    msg: 'Something went wrong'
                });
            }
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
        }
    },

    postEnrollParentNew: async function (req, res) {
        var {
            userInfo,
            parentData
        } = req.body;
        studentID = req.session.studentID;
        try {
            console.log(userInfo);
            console.log(parentData);

            var userID = await getNextParentID();
            console.log(userID);
            var password = generator.generate({
                length: 12,
                numbers: true
            });
            console.log(password)
            var hash = await bcrypt.hash(password, saltRounds)

            // create user
            var user = new User(userID, hash, userInfo.firstName, userInfo.lastName, userInfo.middleName, 'P', userInfo.gender);
            var newUser = new userModel(user);
            var userResult = await newUser.recordNewUser();
            console.log(userResult);
            //create parent
            if (userResult) {
                var parent = new Parent(userID, parentData.phoneNum, parentData.nationality,
                    parentData.birthDate, parentData.birthPlace);
                console.log(parent);
                var newParent = new parentModel(parent);
                var parentResult = await newParent.recordNewParent();
                console.log(parentResult);

                // assign student
                // reminder to self, add siblings and education background
                if (parentResult) {
                    var assignResult = await assignParent(userID, studentID);
                    if (assignResult) {
                        req.session.studentID = userID;
                        console.log(req.session);
                        res.send({
                            status: 201,
                            userID: userID,
                            password: password
                        })
                    } else {
                        res.send({
                            status: 401,
                            msg: 'There is an error when adding user'
                        });
                    }
                } else {
                    res.send({
                        status: 401,
                        msg: 'There is an error when adding user'
                    })
                }
            } else {
                res.send({
                    status: 401,
                    msg: 'There is an error when adding user'
                })
            }
            res.send({
                status: 500,
                msg: 'Something went Wrong'
            });
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
            // console.log('It entered the catch');
        }
    },

    /*
     USER SETTINGS FUNCTIONS
     */


    postUserSettingsSY: function (req, res) {
        req.session.userSettings.schoolYear = req.params.SY;
        res.send();
    },
    postUserSettingsGL: function (req, res) {
        req.session.userSettings.gradeLvl = req.params.GL;
        res.send();
    },

    postUserSettingsSID: function (req, res) {
        req.session.userSettings.studentID = req.params.SID;
        res.send();
    }
}
module.exports = indexFunctions;