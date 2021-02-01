const userModel = require('../model/usersdb');
const studentModel = require('../model/studentdb');

const indexMiddleware = {
    validateEnrollOldParent : async function (req,res,next){
        var firstName = req.body.parentInfo.firstName;
        var parentID = req.body.parentInfo.parentID;
        var lastName = req.body.parentInfo.lastName;
        var middleName = req.body.parentInfo.middleName;
        try {
            console.log(parentID);

            var user = await userModel.findOne({
               userID: parentID
             });

             console.log(user);
             
            if(user != null)
             {
                if(user.type != 'P')
                    res.send({status: 401, msg: 'User is not a Parent'})
                 else if (user.firstName != firstName || user.middleName != middleName || user.lastName != lastName)
                    res.send({status : 401, msg : 'Credentials do not match'});
                else return next();
             }
            else res.send({status: 401, msg : 'User not found'});
            console.log(user);
        } catch (e) {
            res.send({status: 500, msg: e});
        }
        
    }
};

module.exports = indexMiddleware;
