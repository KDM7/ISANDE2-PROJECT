var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('cc_payment'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const cc_paymentSchema = new mongoose.Schema({
    paymentID: { type: Number, required: true},
    ccType : {type : String, required:true},
    ccExp: {type:String,required:true},
    ccHolderName: {type:String,required:true}
}, { collection: "cc_payment" });

cc_paymentSchema.methods.recordNewCCPayment = async function() {
    var result = await cc_paymentModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const cc_paymentModel = db.model('cc_payment', cc_paymentSchema);

module.exports = cc_paymentModel;