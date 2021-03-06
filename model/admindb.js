var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('admin: admindb.js;4'); },
        err => {
            console.log('theres problems: admindb.js;6');
        });

var db = mongoose.connection;

const adminSchema = new mongoose.Schema({
    userID: { type: String, required: true},
    dateCreated : {type : Date, required : true}
}, { collection: "admins" });


const adminModel = db.model('admins', adminSchema);

module.exports = adminModel;