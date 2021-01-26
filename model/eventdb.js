var mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@itisdev.uy0ui.mongodb.net/ISANDE?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('events'); },
        err => {
            console.log('theres problems');
        });

var db = mongoose.connection;

const eventSchema = new mongoose.Schema({
    eventID : {type:Number,required:true},
    eventName: {type:String, required:true},
    eventDate: {type:Date,required:true},
    schoolYear : {type:String, required:true}
}, { collection: "events" });


const eventModel = db.model('events', eventSchema);

module.exports = eventModel;