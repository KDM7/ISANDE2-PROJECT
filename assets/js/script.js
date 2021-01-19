$(document).ready(function() {
    $('#submitLogin').click(function() {

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
            }, function(result) {
                console.log(result);
                switch (result.status) {
                    case 201:
                        {
                            //admin
                            window.location.href = '/a/users/students';
                            break;
                        }
                    case 202:
                        {
                            //teacher
                            window.location.href = '/t/users/students';
                            break;
                        }
                    case 203:
                        {
                            //parent
                            window.location.href = '/p/trans/brkdwn';
                            break;
                        }
                    case 204:
                        {
                            //student
                            window.location.href = '/s/trans/brkdwn';
                            break;
                        }
                    case 401:
                        {
                            alert('case 401: ' + result.msg);
                            break;
                        }
                    case 500:
                        {
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
    $('#submitEnrollNew').click(function(){
        var sectionID = $('#gradeLvl').val();
        var userInfo = {
            firstName :         $('#firstName').val(),
            lastName :          $('#lastName').val(),
            middleName :        $('#middleName').val(),
            gender :            $('#gender').val(),
        };
        
        var studentDetails ={
            familyRecords : {
                mName:          $('#mName').val(),
                mOccu :         $('#mOccu').val(),
                mEmail :        $('#mEmail').val(),
                mWorkAddress :  $('#mWorkAddress').val(),
                mNum :          $('#mNum').val(),
                fName :         $('#fName').val(),
                fOccu :         $('#fOccu').val(),
                fEmail :        $('#fEmail').val(),
                fWorkAddress :  $('#fWorkAddress').val(),
                fNum :          $('#fNum').val(),
                cName :         $('#cName').val(),
                relation :      $('#relation').val(),
                cEmail :        $('#cEmail').val(),
                cNum :          $('#cNum').val(),
                cWorkAddress :  $('#cWorkAddress').val(),
                fetcherName :   $('#fetchName').val(),
                fetchNum :      $('#fetchNum').val(),
                //siblings : 
            },
            //eduBackground :
            reason :            $('#reason').val()
        };
        var studentData ={
            mobileNum :         $('#mobileNum').val(),
            teleNum :           $('#teleNum').val(),
            nationality :       $('#nationality').val(),
            birthDate :         $('#birthDate').val(),
            birthPlace:         $('#birthPlace').val(),
            email :             $('#email').val(),
            religion:           $('#religion').val(),
            address :           $('#address').val()         
        }
        alert('Thank you for applying, these are the user credentials \nUserID:.....\nPassword:...')
        console.log(sectionID);
        console.log(studentDetails);
        console.log(studentData);
    });
});