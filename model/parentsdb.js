var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('parent'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const parentSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    mobileNum : { type: String, required: true},
    nationality : { type : String, required : true},
    birthDate : {type : Date, required : true},
    birthPlace : { type : String, required :true}
}, { collection: "parents" });


const parentModel = db.model('parents', parentSchema);

module.exports = parentModel;