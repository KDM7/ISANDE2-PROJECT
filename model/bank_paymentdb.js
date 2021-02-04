var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('bank_payment'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const bank_paymentSchema = new mongoose.Schema({
    paymentID: { type: Number, required: true},
    accountNumber: {type: Number, required:true},
    accountName:{type:String, required:true}
}, { collection: "bank_payment" });

bank_paymentSchema.methods.recordNewBankPayment = async function() {
    var result = await bank_paymentModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const bank_paymentModel = db.model('bank_payment', bank_paymentSchema);

module.exports = bank_paymentModel;