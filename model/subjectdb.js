var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user: subjectdb.js;4'); },
        err => {
            console.log('theres problems: subjectdb.js;6');
        });

var db = mongoose.connection;

const subjectSchema = new mongoose.Schema({
    subjectCode : { type: Number, required: true},
    SubjectName : {type : String, required : true}
}, { collection: "subjects" });


const subjectModel = db.model('subjects', subjectSchema);

module.exports = subjectModel;