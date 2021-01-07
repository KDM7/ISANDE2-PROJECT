var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const ref_sectionSchema = new mongoose.Schema({
    sectionName : {type : String, required : true},
    gradeLvl : {type : String , required :true},
}, { collection: "ref_section" });


const ref_sectionModel = db.model('ref_section', ref_sectionSchema);

module.exports = ref_sectionModel;