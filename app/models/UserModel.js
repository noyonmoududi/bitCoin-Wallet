const Model = loadCore('model');
const bcrypt = require('bcryptjs');

module.exports = class UserModel extends Model {
    constructor() {
        super();
        this.table = 'users';
        this.primaryKey = 'id';
    }


    attemptLogin(email, password, Req) {
        let _this = this;
        return new Promise((resolve, reject) => {
            let loginRes = {
                error: 0,
                login: 'success',
                data: {}
            };
            _this.db(_this.table).where('email', email).first().then(res => {
                if (res.email) {
                    let user = res;
                    if (user && bcrypt.compareSync(password, user.password)) {
                        Req.session.user = user;
                        loginRes.data = Req.session.user;
                        resolve(loginRes);
                    } else {
                        Req.flash('login_fail', 'E-email/Password didn\'t match');
                        loginRes.error = 1;
                        loginRes.login = 'fail';
                        loginRes.data = { message: 'E-email/Password didn\'t match' };
                        reject(loginRes)
                    }
                } else {
                    Req.flash('login_fail', 'Registered E-mail not Found!');
                    loginRes.error = 1;
                    loginRes.login = 'fail';
                    loginRes.data = { message: 'Registered E-mail not Found!' };
                    reject(loginRes)
                }
            }).catch(err => {
                console.log(err);
                return reject(err)
            })
        })
    }

    encryptPassword(password) {
        const bcrypt = require('bcryptjs');
        return bcrypt.hashSync(password, 10);
    }

    passwordIsValid(user_id, password) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.db(_this.table).where('id', user_id).first().then(res => {
                if (res.id) {
                    let user = res;
                    if (user && bcrypt.compareSync(password, user.password)) {
                        resolve({ is_valid: true })
                    } else {
                        resolve({ is_valid: false })
                    }
                } else {
                    reject({
                        is_valid: false,
                        message: 'Registered E-mail not Found!'
                    })
                }
            }).catch(err => {
                console.log(err);
                return reject(err)
            })
        })
    }

    UpatePassword(id, new_passowrd) {
        let password = this.encryptPassword(new_passowrd)
        return this.db(this.table).where('id', id).update({ password });
    }
    addResetLink(Req, email) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this.db(_this.table).where('email', email).first().then(user => {
                if (user.email) {
                    resolve({ email, message: 'Reset link has sent to "' + email + '"' });
                } else {
                    Req.flash('flash_fail', 'Registered E-mail not Found!');
                    loginRes.error = 1;
                    loginRes.login = 'fail';
                    loginRes.data = { message: 'Registered E-mail not Found!' };
                    reject(loginRes)
                }

            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })
    }
};