const Controller = require('./Controller');
const bcrypt = require('bcryptjs');
module.exports = class user extends Controller {

    constructor() {
        super();
    }

    login(Req, Res) {
        let data = {
            Request: Req
        }
        data.page_title = 'Login';

        if (Req.session.user) {
            return Res.redirect(`/dashboard`);
        }
        data.login_fail = Req.flash('login_fail');
        Res.render('pages/auth/login', data);
    }
    attemptLogin(Req, Res) {
        let RequestData = loadValidator(Req, Res);
        let email = RequestData.post('email', true).val();
        let password = RequestData.post('password', true).val();

        let UserModel = loadModel('UserModel');
        UserModel.attemptLogin(email, password, Req, Res).then(res => {
            return Res.redirect(`/dashboard`);
        }).catch(err => {
            console.log(err);
            return back(Req, Res);
        })
    }
    logout(Req, Res) {
        delete Req.session.user;
        Res.redirect(`/login`);
    }

    register(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        Res.render('pages/auth/register', data);
    }

    registerSubmit(Req, Res) {
        let RequestData = loadValidator(Req, Res);
        let req_data = {
            first_name: RequestData.post('first_name', true, 'First Name').val(),
            last_name: RequestData.post('last_name', true, 'Last Name').val(),
            email: RequestData.post('email', true, 'E-mail').type('email').val(),
            password: RequestData.post('password', true, 'Password').sameAs('confirm_password').val(),
        };

        if (RequestData.validate()) {
            let UserModel = loadModel('UserModel');
            req_data.password = bcrypt.hashSync(req_data.password, 10);
            UserModel.db(UserModel.table).insert(req_data).then(res => {
                Req.session.flash_success = 'Registration complete successfully';
                Res.redirect(`/login`);
            }).catch(err => {
                Res.send(err)
            })
        }
    }
    updatePassword(Req, Res) {
        let data = {
            Request: Req,
            errors: Req.flash('errors')[0],
            old: Req.flash('old')[0]
        }
        Res.render('pages/auth/change_password', data);
    }
    async updatePasswordSubmit(Req, Res) {
        let RequestData = loadValidator(Req, Res);
        let user_id = Req.session.user.id;
        let old_password = RequestData.post('old_password', true).val()
        let password = RequestData.post('password', true).sameAs('confirm_password').val()
        if (!RequestData.validate()) return false;

        let UserModel = loadModel('UserModel');
        try {
            let { is_valid, message } = await UserModel.passwordIsValid(user_id, old_password)
            if (is_valid) {
                let res = await UserModel.UpatePassword(user_id, password)
                console.log(res)
                Req.session.flash_success = 'Password has been updated';
            } else {
                Req.session.flash_fail = message || "Old Password didn't match";
            }
            return back(Req, Res)
        } catch (err) {
            console.log(err)
            Req.session.flash_fail = 'Something went wrong';
            return back(Req, Res)
        }
    }

    resetPassword(Req, Res) {
        let data = {
            Request: Req,
        }
        data.page_title = 'Forget password reset';
        Res.render('pages/auth/reset_password', data);

    }

    resetPasswordSubmit(Req, Res) {
        let data = {
            Request: Req
        }
        let RequestData = loadValidator(Req, Res);
        let email = RequestData.post('email', true).value;

        let UserModel = loadModel('UserModel');
        UserModel.addResetLink(Req, email).then(res => {
            data.page_title = 'Success! Password reset link'
            data.reset_message = res.message;
            Res.render('pages/auth/reset_success', data);
        }).catch(err => {
            console.log(err);
            return back(Req, Res);
        })
    }
}


