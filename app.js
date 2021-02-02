const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Making a session with a given key

app.use(cookieParser());
app.use(session({
    'secret': 'ISANDE',
    'name': "cookie",
    'resave': true,
    'saveUninitialized': true
}));

// Initialize the view
app.use(express.static(__dirname + '/'));
app.set('views', path.join(__dirname, 'views/'));
app.engine('hbs', exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: 'views/partials',
    layoutsDir: 'views/layouts',
    helpers: {
        isSelected: function (selected) {
            if (selected)
                return 'selected';
        },
        getDate: function (date) {
            var d = new Date(date);
            var day, month;
            day = d.getDate();
            if (day < 10)
                day = '0' + day;
            month = d.getMonth() + 1;
            if (month < 10)
                month = '0' + month;

            return month + '/' + day + '/' + d.getFullYear();
        },
        getRemark: function (remarks) {
            var remark;
            switch (remarks) {
                case 'P': {
                    remark = 'Passed';
                    break;
                }
                case 'R': {
                    remark = 'Repeat';
                    break;
                }
                case 'E': {
                    remark = 'Enrolled';
                    break;
                }
                case 'D': {
                    remark = 'Rejected';
                    break;
                }
                case 'FA': {
                    remark = 'For Approval';
                    break;
                }
                default:{
                    remark = 'N/A'
                    break;
                }

            }
            return remark;
        },
        getRemarkColor: function (remarks) {
            var color;
            switch (remarks) {
                case 'P': {
                    color = 'text-success';
                    break;
                }
                case 'R': {
                    color = 'text-danger';
                    break;
                }
                case 'E': {
                    color = 'text-primary';
                    break;
                }
                case 'D': {
                    color = 'text-warning';
                    break;
                }
                case 'FA': {
                    color = 'text-info';
                    break;
                }
                default:{
                    color = 'text-secondary'
                    break;
                }

            }
            return color;
        },
        notifyRemark: function(remark){
            if(remark != 'FA')
            return 'hidden';
        },
    }
}).engine);
app.set('view engine', 'hbs');

// MIDDLEWARES => functions that run before we execute the control functions
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// ROUTERS
const indexRouter = require('./router/userindexRouter');
const {
    text
} = require('body-parser');
app.use('/', indexRouter)

// log this in console when ran
app.listen(PORT, () => {
    console.log(`Listening to localhost on port ${PORT}`);
});