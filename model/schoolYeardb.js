var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user: schoolYeardb.js;4'); },
        err => {
            console.log('theres problems: schoolYeardb.js;6');
        });

var db = mongoose.connection;

const schoolYearSchema = new mongoose.Schema({
    schoolYear : {type : String, required : true},
    isCurrent: { type: Boolean, required: true }
}, { collection: "schoolYears" });


const schoolYearModel = db.model('schoolYears', schoolYearSchema);

module.exports = schoolYearModel;