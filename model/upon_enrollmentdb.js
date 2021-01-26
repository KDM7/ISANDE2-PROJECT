var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('upon_enrollment'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const upon_enrollmentSchema = new mongoose.Schema({
    sectionID : { type: Number, required: true},
    sectionName : { type : String, required : true},
    fullPayment : { type: Number, required: true},
    semestralPayment : { type: Number, required: true},
    trimestralPayment : { type: Number, required: true},
    quarterlyPayment : { type: Number, required: true},
    monthlyPayment : { type: Number, required: true},
    schoolYear : { type: String, required: true},
}, { collection: "upon_enrollment" });

const upon_enrollmentModel = db.model('upon_enrollment', upon_enrollmentSchema);

module.exports = upon_enrollmentModel;