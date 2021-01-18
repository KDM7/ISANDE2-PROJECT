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
                console.log(result.status);
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
                    case 500:
                        {
                            alert('case 500' + result.msg);
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

    $('#submitEnrollNew').click(function(){
        var sectionID = $('#gradeLvl').val();
        var userInfo = {
            firstName : $('#firstName').val(),
            lastName : $('#lastName').val(),
            middleName : $('#middleName').val(),
            gender : $('#gender').val(),
        };
        
        
    });
});