const bcrypt = require('bcryptjs');

module.exports= class PasswordHash{
    hash(password){

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password.trim(), salt);
        return hash;
    }

    hashCompare(password,hash){
        return bcrypt.compareSync(password.trim(),hash);
    }

};