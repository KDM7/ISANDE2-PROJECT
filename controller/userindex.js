// 

const fs = require('fs');
const handlebars = require('handlebars');

// 

const userModel = require("../model/usersdb");
const adminModel = require("../model/admindb");
const teacherModel = require("../model/teacherdb");
const parentModel = require("../model/parentsdb");
const studentModel = require("../model/studentdb");

// const bcrypt = require('bcrypt');
const e = require('express');
const saltRounds = 10;

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

async function findUser(userID) {
    var user = await userModel.aggregate([{
        '$match' : {
            'userID' : userID
        }
    }, {
        '$project' : {
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

const indexFunctions = {
    // to show the login page
    getLogin: function (req, res) {
        res.render('login', {
            title: 'Login'
        });
    },
    // to show the students from the admins side
    getAuserStudents: function (req, res) {
        res.render('a_users_students', {
            title: 'Students'
        });
    },

    // to show edit student agreements page for admins side
    getAdocEditSA: function(req, res){
        res.render('a_doc_editSA', {
            title: 'Edit Student Agreement',
        });
    },

    // to show edit student documents page for admins side
    getAdocEditSD: function(req, res){
        res.render('a_doc_editSD', {
            title: 'Edit Student Document',
        });
    },

    // to show new student agreements page for admin side
    getAdocNewSA: function(req, res){
        res.render('a_doc_newSA', {
            title: 'New Student Agreement',
        });
    },

    // to show new student documents page for admin side
    getAdocNewSD: function(req, res){
        res.render('a_doc_newSD', {
            title: 'New Student Document',
        });
    },

    // to show student agreements page for admin side
    getAdocSA: function(req, res){
        res.render('a_doc_SA', {
            title: 'Student Agreement',
        });
    },

    // to show student documents page for admin side
    getAdocSD: function(req, res){
        res.render('a_doc_SD', {
            title: 'Student Document',
        });
    },

    // to show Additional Fees page for admin side
    getAfeeAdd: function(req, res){
        res.render('a_fee_add', {
            title: 'Additional Fees',
        });
    },

    // to show Edit Upon Enrollment page for admin side
    getAfeeEditUE: function(req, res){
        res.render('a_fees_editUE', {
            title: 'Edit Upon Enrollment'
        });
    },

    // to show Miscellaneous Fees page for admin side
    getAfeeMisc: function(req, res){
        res.render('a_fee_misc',{
            title: 'Miscellaneous Fees'
        });
    },

    // to show Other Fees page for admin side
    getAfeeOthers: function(req, res){
        res.render('a_fees_others', {
            title: 'Other Fees'
        });
    },

    // to show Tuition Fees page for admin side
    getAfeeTuition: function(req, res){
        res.render('a_fees_tuition', {
            title: 'Tuition Fees',
        });
    },

    // to show Upon Enrollment page for admin side
    getAfeeUponE: function(req, res){
        res.render('a_fees_uponE', {
            title: 'Upon Enrollment',
        });
    },

    // to show all admins for admin side
    getAuserAdmin: function(req, res){
        res.render('a_users_admins', {
            title: 'Admins',
        })
    },

    // to show the profile of an admin for admin side
    getAuserAProf: function(req, res){
        res.render('a_users_AProfile', {
            title: 'Admin',
        });
    },

    // to show all accounts of all of the parent's children for admin side
    getAuserPAcc: function(req, res){
        res.render('a_users_PAccount', {
            title: 'Admin',
        });
    },

    // to show all of the parents for admin side
    getAuserParent: function(req, res){
        res.render('a_users_parents', {
            title: 'Parents',
        });
    },

    //to show the profile of a parent for admin side 
    getAuserPProf: function(req, res){
        res.render('a_users_PProfile', {
            title: 'Parent',
        });
    },

    // to show a students account for admin side
    getAuserSAcc: function(req, res){
        res.render('a_users_SAccount', {
            title: 'Student',
        });
    },

    // to show page for sending a student an email for admin side
    getAuserSEmail: function(req, res){
        res.render('a_users_SEmail', {
            title: 'Send Email',
        });
    },

    // to show a students profile for admin side
    getAuserSProf: function(req, res){
        res.render('a_users_SProfile', {
            title: 'Student',
        });
    },

    // to show the students from the teachers dis
    getTuserStudents: function (req, res) {
        res.render('t_users_students', {
            title: 'Students'
        });
    },
    // to show the breakdown of details from the parents side
    getPtransBD: function (req, res) {
        res.render('p_trans_BD', {
            title: 'Breakdown of Details'
        });
    },
    // to show the breakdown of details from the students side
    getStransBD: function (req, res) {
        res.render('s_trans_BD', {
            title: 'Breakdown of details'
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
            if (match) {
                // bcrypt.compare(pass, match.password, function (err, result) {
                    var result = match.password == pass;
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
                        } else if (match.type == 'P'){
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
                // });
            } else res.send({
                status: 401,
                msg: 'No user found.'
            });
        } catch (e) {
            res.send({
                status: 500,
                msg: e
            });
        }
    },
}

module.exports = indexFunctions;

