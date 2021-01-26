var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user: memberdbjs;4'); },
        err => {
            console.log('theres problems: memberdbjs;6');
        });

var db = mongoose.connection;

const memberSchema = new mongoose.Schema({
    sectionID : {type : Number, required : true},
    studentID : {type :String,required :true}
}, { collection: "members" });


const memberModel = db.model('members', memberSchema);

module.exports = memberModel;