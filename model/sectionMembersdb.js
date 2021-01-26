var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('sectionMembers: sectionMembersdb.js;4'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const sectionMemberSchema = new mongoose.Schema({
    sectionID : {type : Number, required : true},
    studentID : {type : String, required : true}
}, { collection: "studentMembers" });


const sectionMemberModel = db.model('studentMembers', sectionMemberSchema);

module.exports = sectionMemberModel;