var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('parent: parentsdb.js;4'); },
        err => {
            console.log('theres problems: parentsdb.js;6');
        });

var db = mongoose.connection;

const parentSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    phoneNum : { type: String, required: true},
    nationality : { type : String, required : true},
    birthDate : {type : Date, required : true},
    birthPlace : { type : String, required :true},
}, { collection: "parents" });

parentSchema.methods.recordNewParent = async function() {
    var result = await parentModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const parentModel = db.model('parents', parentSchema);

module.exports = parentModel;