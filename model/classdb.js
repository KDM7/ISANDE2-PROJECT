var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('classes'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const classSchema = new mongoose.Schema({
    classID : {type:Number,required:true},
    room : {type:String, required:true},
    teacherID : {type:String, required:true},
    sectionID : {type:Number, required:true},
    subjectCode : {type:String, required:true},
    day: {
        type: String,
        required: true
    },
    time: {
        type: {
            from: {
                type: String,
                required: true,
                match: /^([01]\d|2[0-3]):([0-5]\d)$/
            },
            to: {
                type: String,
                required: true,
                match: /^([01]\d|2[0-3]):([0-5]\d)$/
            }
        }
    }
}, { collection: "classes" });

const classModel = db.model('classes', classSchema);

module.exports = classModel;