const customFields={
    usernameField:'uname',
    passwordField:'pw',
};


const userLogout = (req, res, next) => {
    console.log('logout processed');
    req.session.destroy();
    req.logout();
    res.redirect('/post/about');
};

const userRegister = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const input_username = req.body.username;
    const input_email = req.body.email;
    const input_password = req.body.password;


    console.log(input_username);

    const userExists = connection.query('Select * from users where username=? ', [input_username], function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('Result :', doc); // false
            return doc;
        }
    });


/* function userExists(req,res,bext) {
    connection.query('Select * from users where username=? ', [req.body.uname], function(error, results, fields) {
        if(error) {
            console.log("Error");
        } else if(results.length>0) {
            res.redirect('/userAlreadyExists')
        } else {
            next();
        }

    });

} */

    //const emailExists = User.exists({ email: input_email }, function (err, doc) {
    const emailExists = connection.query('Select * from users where email=? ', [input_email], function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log('Result :', doc); // false
            return doc;
        }
    });

    console.log(userExists);
    


    if (userExists != null || emailExists != null) {
        console.log('User or email exists');
        res.redirect('register');
    } else {
        console.log(input_email, input_password, input_username);
        newUser = new User({ email: req.body.email, username: req.body.username });
        connection.query('Insert into users(email, username, password) values(?,?,?) ', [input_email, input_username, input_password], function(err, results, doc) {
            if (err) {
                console.log(err);
                res.redirect('/user/register');
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/post');
                });
            }
        });
    }
};

module.exports = {
    userRegister,
    userLogout
};
