var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user: userdb.js;4'); },
        err => {
            console.log('theres problems: userdb.js;6');
        });

var db = mongoose.connection;

const userSchema = new mongoose.Schema({
    userID: { type: String, required: true},
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, required: true },
    type: { type: String, required: true },
    gender: { type: String, required: true }
}, { collection: "users" });

userSchema.methods.recordNewUser = async function() {
    var result = userModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const userModel = db.model('users', userSchema);

module.exports = userModel;