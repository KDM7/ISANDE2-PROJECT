var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('sectionMembers'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const sectionMemberSchema = new mongoose.Schema({
    sectionID : {type : Number, required : true},
    studentID : {type : String, required : true}
}, { collection: "sectionMembers" });


const sectionMemberModel = db.model('sectionMembers', sectionMemberSchema);

module.exports = sectionMemberModel;