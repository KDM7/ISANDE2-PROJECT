var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const paymentSchema = new mongoose.Schema({
    paymentNum: { type: Number, required: true},
    amountPaid : {type : Number, required : true},
    datePaid : {type : Date, required : true},
    remarks : {type : String, required :true},
    studentID : {type : String, required : true}
}, { collection: "payments" });


const paymentModel = db.model('payments', paymentSchema);

module.exports = paymentModel;