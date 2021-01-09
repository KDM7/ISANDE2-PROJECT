// 

const fs = require('fs');
const handlebars = require('handlebars');

// 

const userModel = require("../model/usersdb");
const adminModel = require("../model/admindb");
const teacherModel = require("../model/teacherdb");
const parentModel = require("../model/parentsdb");
const studentModel = require("../model/studentdb");

const bcrypt = require('bcrypt');
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
    }
}



