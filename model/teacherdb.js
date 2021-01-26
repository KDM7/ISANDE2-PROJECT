var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('teacher: teacherdb.js;4'); },
        err => {
            console.log('theres problems: teacherdb.js;6');
        });

var db = mongoose.connection;

const teacherSchema = new mongoose.Schema({
    userID: { type: String, required: true},
    dateCreated : {type : Date, required : true}
}, { collection: "teachers" });


const teacherModel = db.model('teachers', teacherSchema);

module.exports = teacherModel;