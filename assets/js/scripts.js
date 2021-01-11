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
                    case 203:
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
});