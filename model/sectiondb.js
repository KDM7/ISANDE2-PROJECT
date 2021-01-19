var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user: sectiondb.js;4'); },
        err => {
            console.log('theres problems: sectiondb.js;6');
        });

var db = mongoose.connection;

const sectionSchema = new mongoose.Schema({
    sectionID : {type : Number, required : true},
    schoolYear : {type : String, required : true},
    sectionName : {type : String, required:true},
    sectionAdviser : {type : String, required : false}
}, { collection: "sections" });


const sectionModel = db.model('sections', sectionSchema);

module.exports = sectionModel;