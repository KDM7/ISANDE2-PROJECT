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
            var match = await findUser(parseInt(user));
            if (match) {
                // bcrypt.compare(pass, match.password, function (err, result) {
                    if (result) {
                        if (match.isSysAd) {
                            //send 201 admin
                            req.session.logUser = match;
                            req.session.type = 'admin';
                            res.send({
                                status: 201
                            });
                        } else if (match.teacherID) {
                            //send 202 teacher
                            req.session.logUser = match;
                            req.session.type = 'teacher';
                            res.send({
                                status: 202
                            });
                        } else if (match.parentID){
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



