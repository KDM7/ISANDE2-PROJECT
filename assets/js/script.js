//checks if the string has a number
function hasNumber(myString) {
    return /\d/.test(myString);
}

// checks if the string only contains number
function isNumber(myString) {
    return /^\d+$/.test(myString);
}

// check user data to see if it is valid when creating any new user
function checkUserInfo(userInfo) {
    var valid = true;
    var inv_fields = 'User info is invalid. Modify the following : \n';

    if (validator.isEmpty(userInfo.firstName) || hasNumber(userInfo.firstName)) {
        valid = false;
        inv_fields += '     First Name is empty or invalid\n';
    }

    if (validator.isEmpty(userInfo.lastName) || hasNumber(userInfo.lastName)) {
        valid = false;
        inv_fields += '     Last Name is empty or invalid\n';
    }

    if (validator.isEmpty(userInfo.middleName) || hasNumber(userInfo.middleName)) {
        valid = false;
        inv_fields += '     Middle Name is empty or invalid\n';
    }

    if (!valid)
        alert(inv_fields);

    return valid;
}

/*
    Checks student data if it is valid
    mobileNum :     11 digit Number
    teleNum :       empty or 7 digit Number
    nationality :   Not Empty
    birthDate :     Date is 2 years Before Current Date
    birthPlace:     Not Empty    
    email :         valid email
    religion:       Not Empty
    address :       Not Empty

*/
function checkStudentData(studentData) {
    var valid = true;
    var inv_fields = 'Student info is invalid. Modify the following : \n';
    var valid_date = new Date();
    valid_date.setFullYear(valid_date.getFullYear() - 2);


    if (validator.isEmpty(studentData.mobileNum) || !isNumber(studentData.mobileNum) || studentData.mobileNum.length != 11) {
        valid = false;
        inv_fields += '     Mobile Number is empty or invalid\n';
    }

    if (!validator.isEmpty(studentData.teleNum)) {
        if (!isNumber(studentData.teleNum) || studentData.teleNum.length != 7) {
            valid = false;
            inv_fields += '     Telephone Number is invalid\n';
        }
    } else studentData.teleNum = '';

    if (validator.isEmpty(studentData.nationality)) {
        valid = false;
        inv_fields += '     Nationality is empty\n';
    }

    if (validator.isAfter(studentData.birthDate, valid_date.toDateString())) {
        valid = false;
        inv_fields += '     Birth Date is invalid\n';
    }

    if (validator.isEmpty(studentData.birthPlace)) {
        valid = false;
        inv_fields += '     Birth Place is empty\n';
    }

    if (!validator.isEmail(studentData.email)) {
        valid = false;
        inv_fields += '     Email is empty or invalid\n'
    }

    if (validator.isEmpty(studentData.religion)) {
        valid = false;
        inv_fields += '     Religion is empty\n';
    }

    if (validator.isEmpty(studentData.address)) {
        valid = false;
        inv_fields += '     Address is empty\n';
    }

    if (!valid)
        alert(inv_fields);

    return valid;
}

/* 
    checks if student Details are valid
     familyRecords : {
                mName:              Valid String With No Numbers
                mOccu :             Not Empty
                mEmail :            Empty or Valid email
                mWorkAddress :      No Requirement
                mNum :              empty or valid phoneNumber(telephone or mobile)
                fName :             Not String with no Numbers
                fOccu :             Not Empty
                fEmail :            Empty or valid email
                fWorkAddress :      No Requirement
                fNum :              empty or valid phoneNumber
                cName :             Valid String with no numbers
                relation :          No Requirements
                cEmail :            empty or valid email
                cNum :              empty or valid phoneNumber
                cWorkAddress :      No Requirement
                fetchName :       Empty or Valid String with no numbes
                fetchNum :          Empty or PhoneNUm
                //siblings : 
            },
            //eduBackground :
            reason :                
*/
function checkStudentDetails(studentDetails) {
    var valid = true;
    var inv_fields = 'Family Record is invalid. Modify the following : \n';

    if (validator.isEmpty(studentDetails.familyRecords.mName) || hasNumber(studentDetails.familyRecords.mName)) {
        valid = false;
        inv_fields += "     Mother's Name is empty or invalid\n";
    }

    if (validator.isEmpty(studentDetails.familyRecords.mOccu)) {
        valid = false;
        inv_fields += "     Mother's Occupation is empty\n";
    }

    if (!validator.isEmpty(studentDetails.familyRecords.mEmail)) {
        if (!validator.isEmail(studentDetails.familyRecords.mEmail)) {
            valid = false;
            inv_fields += "     Mother's Email is invalid\n";
        }
    } else studentDetails.familyRecords.mEmail = '';

    if (!validator.isEmpty(studentDetails.familyRecords.mNum)) {
        if (!(isNumber(studentDetails.familyRecords.mNum) && (studentDetails.familyRecords.mNum.length == 7 ||
                studentDetails.familyRecords.mNum.length == 11))) {
            valid = false;
            inv_fields += "     Mother's Contact Number is invalid\n";
        }
    }

    if (validator.isEmpty(studentDetails.familyRecords.mWorkAddress))
        studentDetails.familyRecords.mWorkAddress = '';

    if (validator.isEmpty(studentDetails.familyRecords.fName) || hasNumber(studentDetails.familyRecords.fName)) {
        valid = false;
        inv_fields += "     Father's Name is empty or invalid\n";
    }

    if (validator.isEmpty(studentDetails.familyRecords.fOccu)) {
        valid = false;
        inv_fields += "     Father's Occupation is empty\n";
    }

    if (!validator.isEmpty(studentDetails.familyRecords.fEmail)) {
        if (!validator.isEmail(studentDetails.familyRecords.fEmail)) {
            valid = false;
            inv_fields += "     Father's Email is invalid\n";
        }
    } else studentDetails.familyRecords.fEmail = '';

    if (!validator.isEmpty(studentDetails.familyRecords.fNum)) {
        if (!(isNumber(studentDetails.familyRecords.fNum) && (studentDetails.familyRecords.fNum.length == 7 ||
                studentDetails.familyRecords.fNum.length == 11))) {
            valid = false;
            inv_fields += "     Father's Contact Number is invalid\n";
        }
    }

    if (validator.isEmpty(studentDetails.familyRecords.fWorkAddress))
        studentDetails.familyRecords.fWorkAddress = '';

    if (validator.isEmpty(studentDetails.familyRecords.cName) || hasNumber(studentDetails.familyRecords.cName)) {
        valid = false;
        inv_fields += "     Contact Person's Name is empty or invalid\n";
    }

    if (validator.isEmpty(studentDetails.familyRecords.relation))
        studentDetails.familyRecords.relation = '';

    if (!validator.isEmpty(studentDetails.familyRecords.cEmail)) {
        if (!validator.isEmail(studentDetails.familyRecords.cEmail)) {
            valid = false;
            inv_fields += "     Contact Person's Email is invalid\n";
        }
    } else studentDetails.familyRecords.cEmail = '';

    if (!validator.isEmpty(studentDetails.familyRecords.cNum)) {
        if (!(isNumber(studentDetails.familyRecords.cNum) && (studentDetails.familyRecords.cNum.length == 7 ||
                studentDetails.familyRecords.cNum.length == 11))) {
            valid = false;
            inv_fields += "     Contact Persons's Phone Number is invalid\n";
        }
    } else studentDetails.familyRecords.cNum = '';

    /* fetcher information cases 
            fetcher name invalid = automatic invalid
            fetcher name valid, no contact number = valid
            fetcher name valid, contact number valid = valid
            fetcher name valid, contact number invalid = invalid
            fetcher name empty, contact number exists = invalid
    */
    if (!validator.isEmpty(studentDetails.familyRecords.fetchName)) {
        if (hasNumber(studentDetails.familyRecords.fetchName)) {
            valid = false;
            inv_fields += "     Fetcher's name is invalid\n";
        } else if (!validator.isEmpty(studentDetails.familyRecords.fetchNum)) {
            if (!(isNumber(studentDetails.familyRecords.fetchNum) && (studentDetails.familyRecords.fetchNum.length == 7 ||
                    studentDetails.familyRecords.fetchNum.length == 11))) {
                valid = false;
                inv_fields += "     Fetcher's Contact Number is invalid\n";
            }
        }
    } else if (!validator.isEmpty(studentDetails.familyRecords.fetchNum)) {
        valid = false;
        inv_fields += "     Fetcher's information is incomplete\n";
    } else {
        studentDetails.familyRecords.fetchNum = '';
        studentDetails.familyRecords.fetchName = '';
    }

    if (!valid)
        alert(inv_fields);

    return valid;
}

function checkEnrollmentData(userInfo, studentData, studentDetails) {
    var val1, val2, val3 = true;

    val1 = checkUserInfo(userInfo);
    val2 = checkStudentData(studentData);
    val3 = checkStudentDetails(studentDetails);
    if (val1 && val2 && val3)
        return true;
    else return false;
}

/*
    This function is used to check parent data
*/

function checkParentDetails(parentData) {
    var valid = true;
    var inv_fields = 'Parent info is invalid. Modify the following : \n';
    var valid_date = new Date();
    valid_date.setFullYear(valid_date.getFullYear() - 15);


    if (validator.isEmpty(parentData.phoneNum) || !isNumber(parentData.phoneNum) || (parentData.phoneNum.length != 11 &&
            parentData.phoneNum.length != 7)) {
        valid = false;
        inv_fields += '     Phone Number is empty or invalid\n';
    }

    if (validator.isEmpty(parentData.nationality)) {
        valid = false;
        inv_fields += '     Nationality is empty\n';
    }

    if (validator.isAfter(parentData.birthDate, valid_date.toDateString())) {
        valid = false;
        inv_fields += '     Birth Date is invalid\n';
    }

    if (validator.isEmpty(parentData.birthPlace)) {
        valid = false;
        inv_fields += '     Birth Place is empty\n';
    }

    if (!valid)
        alert(inv_fields);

    return valid;
}

function checkParentData(userInfo, parentData) {
    var val1, val2 = true;
    val1 = checkUserInfo(userInfo);
    val2 = checkParentDetails(parentData);
    if (val1 && val2)
        return true;
    else return false;
}
$(document).ready(function () {
    $('#submitLogin').click(function () {

        var user = $('#id').val();
        var pass = $('#pword').val();
        // checking if fields are not empty
        if (validator.isEmpty(user)) {
            alert('No user id provided');
        }
        if (validator.isEmpty(pass)) {
            alert('No password provided');
        }

        if (!validator.isEmpty(user) && !validator.isEmpty(pass)) {
            $.post('/', {
                user: user,
                pass: pass
            }, function (result) {
                console.log(result);
                switch (result.status) {
                    case 201: {
                        //admin
                        window.location.href = '/a/users/students';
                        break;
                    }
                    case 202: {
                        //teacher
                        window.location.href = '/t/users/students';
                        break;
                    }
                    case 203: {
                        //parent
                        window.location.href = '/p/trans/brkdwn';
                        break;
                    }
                    case 204: {
                        //student
                        window.location.href = '/s/trans/brkdwn';
                        break;
                    }
                    case 401: {
                        alert('case 401: ' + result.msg);
                        break;
                    }
                    case 500: {
                        alert('case 500: ' + result.msg);
                        break;
                    }
                }
            });
        }
    });

    /*
        ADMIN
    */
    $('#submitNewEvent').click(function () {
        var eventName = $('#eventName').val();
        var eventDate = $('#eventDate').val();

        console.log(eventName);
        console.log(eventDate);

        $.post('/newAcadCalendar', {
            eventName: eventName,
            eventDate: eventDate
        }, function (result) {
            switch (result.status) {
                case 201: {
                    alert(result.msg);
                    window.location.href = '/a/sched/newAcadCalendar';
                    break;
                }
                case 500: {
                    alert('case 500: ' + result.msg);
                    break;
                }
            }
        });
    });
    /*
        TEACHER
    */

    /*
        PARENT
    */

    /*
        STUDENT
    */

    // sibling and educational background is not yet fixed
    $('#submitEnrollNew').click(function () {
        var valid = false;
        var sectionID = $('#gradeLvl').val();
        var userInfo = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            middleName: $('#middleName').val(),
            gender: $('#gender').val(),
        };

        var studentDetails = {
            familyRecords: {
                mName: $('#mName').val(),
                mOccu: $('#mOccu').val(),
                mEmail: $('#mEmail').val(),
                mWorkAddress: $('#mWorkAddress').val(),
                mNum: $('#mNum').val(),
                fName: $('#fName').val(),
                fOccu: $('#fOccu').val(),
                fEmail: $('#fEmail').val(),
                fWorkAddress: $('#fWorkAddress').val(),
                fNum: $('#fNum').val(),
                cName: $('#cName').val(),
                relation: $('#relation').val(),
                cEmail: $('#cEmail').val(),
                cNum: $('#cNum').val(),
                cWorkAddress: $('#cWorkAddress').val(),
                fetchName: $('#fetchName').val(),
                fetchNum: $('#fetchNum').val(),
                //siblings : 
            },
            //eduBackground :
            reason: $('#reason').val()
        };

        var studentData = {
            mobileNum: $('#mobileNum').val(),
            teleNum: $('#teleNum').val(),
            nationality: $('#nationality').val(),
            birthDate: $('#birthDate').val(),
            birthPlace: $('#birthPlace').val(),
            email: $('#email').val(),
            religion: $('#religion').val(),
            address: $('#address').val()
        }

        var valid = checkEnrollmentData(userInfo, studentData, studentDetails);
        console.log(valid);
        if (valid) {
            $.post('/enroll', {
                userInfo: userInfo,
                studentDetail: studentDetails,
                studentData: studentData,
                sectionID: sectionID,
            }, function (result) {
                switch (result.status) {
                    case 201: {
                        //admin

                        alert('Thank you for applying, these are the user credentials \nUserID:' + result.userID +
                            '\nPassword: ' + result.password)
                        window.location.href = '/enroll/parent';
                        break;
                    }
                    case 401: {
                        alert('case 401: ' + result.msg);
                        break;
                    }
                    case 500: {
                        alert('case 500: ' + result.msg);
                        break;
                    }
                }
            })
        }
    });

    /*
        Used to Link Parent and Student Accounts
        If Parent Account Exists
            - Enter Credentials to Verify
                -firstName
                -lastName
                -middleName
                -ParentID
        If Parent does not have account
            -Create Parent Account
    */
    $('#a_u_SP_accept').on('click', function () {
        //    get the id from the parent of th e parent node
        var id = $(this).parent().parent().attr('id');
        //    post to approve enroll function
        $.post('/enroll/approve', {
            id: id
        }, function (result) {
            switch (result.status) {
                case 200: {
                    alert(result.msg);
                    window.location.href = '/a/users/students';
                    break;
                }
                case 500: {
                    alert(result.msg);
                    window.location.href = '/a/users/students';
                    break;
                }
            }
        });
    });
    
    $('#a_u_SP_reject').on('click', function () {
        //    get the id from the parent of th e parent node
        var id = $(this).parent().parent().attr('id');
        //    post to approve enroll function
        $.post('/enroll/deny', {
            id: id
        }, function (result) {
            switch (result.status) {
                case 200: {
                    alert(result.msg);
                    window.location.href = '/a/users/students';
                    break;
                }
                case 500: {
                    alert(result.msg);
                    window.location.href = '/a/users/students';
                    break;
                }
            }
        });
    });


    $('#enroll_Parent').click(function () {
        var exists = $('#if_exist').val();
        console.log(exists);
        if (exists == 'Yes') {
            console.log('I am in existing parent side')
            var parentInfo = {
                firstName: $('#firstName_old').val(),
                lastName: $('#lastName_old').val(),
                middleName: $('#middleName_old').val(),
                parentID: $('#parentID').val()
            };

            console.log(parentInfo);
            var valid = checkUserInfo(parentInfo);
            console.log(valid);

            if (valid && !validator.isEmpty(parentInfo.parentID)) {
                $.post('/enroll/parent/old', {
                    parentInfo: parentInfo,
                }, function (result) {
                    switch (result.status) {
                        case 201: {
                            //admin
                            alert('Link to student is successful. To pay, go to you parent account')
                            window.location.href = '/';
                            break;
                        }
                        case 401: {
                            alert('case 401: ' + result.msg);
                            break;
                        }
                        case 500: {
                            alert('case 500: ' + result.msg);
                            break;
                        }
                    }
                })
            } else if (valid && validator.isEmpty(parentInfo.parentID))
                alert('ParentID is Empty');

            //parent does not exist
        } else {
            var parentInfo = {
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                middleName: $('#middleName').val(),
                gender: $('#gender').val(),
            };

            var parentData = {
                phoneNum: $('#phoneNum').val(),
                nationality: $('#nationality').val(),
                birthDate: $('#birthDate').val(),
                birthPlace: $('#birthPlace').val(),
            }

            var valid = checkParentData(parentInfo, parentData);

            if (valid) {
                $.post('/enroll/parent/new', {
                    userInfo: parentInfo,
                    parentData: parentData,
                }, function (result) {
                    switch (result.status) {
                        case 201: {
                            //admin

                            alert('Thank you for applying, these are the user credentials \nUserID:' + result.userID +
                                '\nPassword: ' + result.password);
                            alert("To pay, please log into your parent account")
                            window.location.href = '/';
                            break;
                        }
                        case 401: {
                            alert('case 401: ' + result.msg);
                            break;
                        }
                        case 500: {
                            alert('case 500: ' + result.msg);
                            break;
                        }
                    }
                })
            }
        }
    });
});