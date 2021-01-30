var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('grades'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const gradeSchema = new mongoose.Schema({
    studentID : {type:String,required:true},
    classID: {type:Number, required:true},
    firstQuarter: {type:Number,required:false},
    secondQuarter : {type:Number, required:false},
    thirdQuarter : {type:Number, required:false},
    fourthQuarter : {type:Number, required:false},
    finalGrade : {type:Number, required:false},
    remarks : {type:String, required:false}
}, { collection: "grades" });

const gradeModel = db.model('grades', gradeSchema);

module.exports = gradeModel;