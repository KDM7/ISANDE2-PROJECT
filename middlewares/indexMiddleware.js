const userModel = require('../model/usersdb');
const studentModel = require('../model/studentdb');
const sectionModel = require('../model/sectiondb');
const upon_enrollmentModel = require("../model/upon_enrollmentdb");
const feesModel = require("../model/feesdb");
const teacherModel = require("../model/teacherdb");

async function getFullPmtSYGL(schoolYear, gradeLvl) {
    var uponEnrollment = await upon_enrollmentModel.aggregate(
        [{
            '$match': {
                'schoolYear': schoolYear
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
                'refSec.gradeLvl': gradeLvl
            }
        }, {
            '$project': {
                '_id': 0,
                'fullPayment': 1,
            }
        }]
    );
    return parseInt(uponEnrollment[0].fullPayment);
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

const indexMiddleware = {
    validateEnrollOldParent: async function (req, res, next) {
        var firstName = req.body.parentInfo.firstName;
        var parentID = req.body.parentInfo.parentID;
        var lastName = req.body.parentInfo.lastName;
        var middleName = req.body.parentInfo.middleName;
        try {
            console.log(parentID);

            var user = await userModel.findOne({
                userID: parentID
            });

            console.log(user);

            if (user != null) {
                if (user.type != 'P')
                    res.send({
                        status: 401,
                        msg: 'User is not a Parent'
                    })
                else if (user.firstName != firstName || user.middleName != middleName || user.lastName != lastName)
                    res.send({
                        status: 401,
                        msg: 'Credentials do not match'
                    });
                else return next();
            } else res.send({
                status: 401,
                msg: 'User not found'
            });
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
        }

    },
    validateEditFees: async function (req, res, next) {
        var schoolYear = req.body.schoolYear;
        var gradeLvl = req.body.gradeLvl;
        var fullPmt = await getFullPmtSYGL(schoolYear, gradeLvl);

        console.log(req.body.fees);
        var sum = parseInt(req.body.sum);
        if (sum == fullPmt)
            return next();

        res.send({
            status: 500,
            msg: 'Sum of Fees(' + sum + ') does not equal Full Payment(' + fullPmt + ') with difference of ' + Math.abs(sum - fullPmt)
        });
    },
    validateSectionAdviser: async function (req, res, next) {
        var adviserID = req.body.adviserID;
        var unavailableLst = await getUnavailableTch();
        var validateID = await teacherModel.aggregate(
            [{
                '$match': {
                    'userID': {
                        '$in': unavailableLst
                    }
                }
            }, {
                '$match': {
                    'userID': adviserID.toString()
                }
            }]
        );
        if(!(validateID[0]))
            return next();

            res.send({
                status: 500,
                msg: 'Teacher is already an adviser to another class'
            });
    },

};

module.exports = indexMiddleware;