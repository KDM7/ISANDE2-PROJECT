var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const studentSchema = new mongoose.Schema({
    userID: { type: String, required: true},
    parentID : {type : String, required : false},
    mobileNum : {type : String, required : true},
    teleNum : {type : String , required : false},
    nationality :{type : String, required : true},
    birthDate : {type : Date, required :true},
    birthPlace : {type : String, required : true},
    email : {type : String, required : true},
    religion : {type : String, required : true},
    address : {type : String, required : true}
}, { collection: "students" });


const studentModel = db.model('students', studentSchema);

module.exports = studentModel;