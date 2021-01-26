var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('user: studentDetailsdb.js;4'); },
        err => {
            console.log('theres problems: studentDetailsdb.js;6');
        });

var db = mongoose.connection;

const studentDetailsSchema = new mongoose.Schema({
    studentID: { type: String, required: true},
    familyRecords : {
        type : {
            mName : {type : String, required : true},
            mOccu : {type : String, required : true},
            mEmail : {type : String, required : false},
            mWorkAddress : {type : String, required : false},
            mNum : {type : String, required : true},
            fName : {type : String, required : true},
            fOccu : {type : String, required : true},
            fEmail : {type : String, required : false},
            fWorkAddress : {type : String, required : false},
            fNum : {type : String, required : true},
            cName : {type :String, required : true},
            relation : {type :String, required : true},
            cEmail : {type : String, required : false},
            cNum : {type : String, required : true},
            cWorkAddress : {type : String, required :false},
            siblings : {type : [{name:String,age:Number,occu:String}] , required : false},
            fetchName : {type : String, required : false},
            fetchNum : {type : String, required :false}

            /*
            siblings array 
             */
        },
        required : true
    },
    eduBackground:{type : [{name:String, acadYear:String}]},
    reason : {type : String, required : true}
}, { collection: "student_details" });

studentDetailsSchema.methods.recordNewStudentDetails = async function() {
    var result = await studentDetailsModel.create(this);
    console.log(JSON.stringify(result));
    return result;
};

const studentDetailsModel = db.model('student_details', studentDetailsSchema);

module.exports = studentDetailsModel;