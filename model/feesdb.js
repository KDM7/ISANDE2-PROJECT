var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const feesSchema = new mongoose.Schema({
    sectionName :{type : String, required : true},
    schoolYear : {type : String, required : true},
    tuition : {type : Number, required : true},
    misc : {type : Number, required : true},
    additional : {type : Number, required : true},
    other : {type : Number, required : true}
}, { collection: "fees" });


const feesModel = db.model('fees', feesSchema);

module.exports = feesModel;