/*
 @Purpose:to get requested data from url query string,url parameter or post body with some basic validation
 @use: require this request in every controller then use this methods
*/

/*

 allow types = number,int,boolean,string,float
 number = float : any number value (allow +-)
 boolean = bool : true/false
 int = integer : any number without point allow +-

*/

module.exports = class RequestData {
    constructor(Request, Response) {
        this.typeOfValue = 'string';
        this.isRequired = false;
        this.validation = {
            'error': 0,
            'error_code': 'REQUEST_DATA_INVALID',
            'details': {}
        }
        this.value = '';
        this.Request = Request;
        this.Response = Response;

    }

    /**
     * 
     * @param String key 
     * @returns string
     */
    get(key) {
        return this.Request.query[key];
    }

    /**
     * 
     * @param String key 
     * @returns string
     */
    params(key) {
        return this.Request.params[key];
    }

    /**
     * 
     * @param String key 
     * @param boolean isRequired 
     * @param string name 
     * @param string custom_message 
     * @returns instance
     */
    post(key, isRequired = false, name = '', custom_message = '') {
        this.isRequired = isRequired;
        this.key = key;
        this.value = this.Request.body[key];
        this.typeOfValue = typeof this.Request.body[key];

        if (this.Request.body[key] !== 0) {
            if ((!this.Request.body[key] && isRequired == true)) {
                if (typeof this.validation.details[key] == 'undefined') {
                    this.validation.error = this.validation.error + 1;
                    this.validation.details[key] = (custom_message != '') ? custom_message : ((name.length > 0) ? name : key) + ' Field is required'
                }
                return this;
            }
        }

        if (typeof this.value == 'string') {
            this.value = this.value.trim();
        }
        return this;
    }

    /**
     * 
     * @param String type 
     * @param string custom_message 
     * @returns instance
     */
    type(type, custom_message = '') {
        let err = 0;

        type = type.toLowerCase();


        if (type == 'int') type = 'integer';
        else if (type == 'bool') type = 'boolean';
        else if (type == 'float') type = 'number';

        if (this.value) {
            if (type == 'integer') {
                if (isNaN(this.value) || parseInt(this.value) != this.value) err = 1;
                else this.value = parseInt(this.value)

            } else if (type == 'number') {
                if ((!isNaN(parseFloat(this.value)) && isFinite(this.value)) == false) err = 1;

            } else if (type == 'email') {
                var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (emailRegEx.test(this.value) == false) err = 1;

            } else if (type == 'boolean') {
                if (!['true', 'false'].includes(this.value)) err = 1;
                else {
                    this.typeOfValue = 'boolean';
                    this.value = (this.value.toLocaleLowerCase() == 'true' || this.value === true)
                }
            } else if (type == 'date') {
                let isValidDate = (dateString) => {
                    var regEx = /^\d{4}-\d{2}-\d{2}$/;
                    if (!dateString.match(regEx)) return false;  // Invalid format
                    var d = new Date(dateString);
                    var dNum = d.getTime();
                    if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
                    return d.toISOString().slice(0, 10) === dateString;
                }
                if (!isValidDate(this.value)) err = 1;
            } else if (type == 'array_int') {
                try {
                    this.value = (!Array.isArray(this.value)) ? JSON.parse(this.value) : this.value;
                    if (Array.isArray(this.value)) {
                        if (this.value.length == 0 && this.isRequired) {
                            err = 1;
                        } else {
                            this.value.every(value => {
                                if (isNaN(value) || parseInt(value) != value) {
                                    err = 1;
                                    return false;
                                }
                                else return true;
                            })
                        }
                    } else err = 1;
                } catch (e) {
                    err = 1;
                }
            }else if (type == 'mobile_bd') {
                const valid_mobile = ( value ) => {
                    let valid_number = value.match("(?:\\+88|88)?(01[3-9]\\d{8})"); /*Regular expression to validate number*/
                    if(valid_number){
                        return valid_number[1];
                    } else {
                        return false;
                    }
                }
                let value_temp = valid_mobile(this.value);
                if(!value_temp || value_temp.length !=11) err =1;
                else this.value = value_temp;
            }
            else {
                if (this.typeOfValue != type) err = 1;
            }
        }
        if (err == 1) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                let type_name = type;
                this.validation.error = this.validation.error + 1;
                if (type == 'array_int') type_name = 'array of int';
                else if (type == 'date') type_name = 'date format YYYY-MM-DD';
                else if(type == 'mobile_bd') type_name = '11 digit valid mobile number';
                this.validation.details[this.key] = (custom_message != '') ? custom_message : 'Data should be ' + type_name
            }
        }
        return this;
    }

    /**
     * 
     * @param int length 
     * @param string custom_message 
     * @returns instance
     */

    length(length, custom_message = '') {
        if ((this.typeOfValue == 'string' && this.value.length != length)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (custom_message != '') ? custom_message : 'Value should be ' + length + ' characters.'
            }
        }
        return this;
    }

    /**
     * 
     * @param int length 
     * @param string custom_message 
     * @returns instance
     */
    minLength(length, messcustom_messageage = '') {

        if ((this.typeOfValue == 'string' && this.value.length < length)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (custom_message != '') ? custom_message : 'Value should be minimum ' + length
            }

        }
        return this;
    }

    maxLength(value, message = '') {

        if ((this.typeOfValue == 'string' && this.value.length > value)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (message != '') ? message : 'Length of the value should be maximum ' + value
            }
        }
        return this;
    }

    maxNumber(value, message = '') {
        if ((isNumber(this.value) && this.value > value)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (message != '') ? message : 'Maximum value should be ' + value;
            }
        }
        return this;
    }

    minNumber(value, message = '') {
        if ((isNumber(this.value) && this.value < value)) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (message != '') ? message : 'Maximum value should be ' + value;
            }
        }
        return this;
    }

    //array or object of values
    disallow(values, message = '') {
        if (this.value || this.value == 0) {
            let match = false;
            for (let value in values) {
                if (this.value == values[value]) {
                    match = true;
                    break;
                }
            }
            if (match == true) {
                if (typeof this.validation.details[this.key] == 'undefined') {
                    this.validation.error = this.validation.error + 1;
                    this.validation.details[this.key] = (message != '') ? message : this.value + ' is not allowed';
                }
            }
        }

        return this;
    }

    allow(values, message = '') {
        if ((this.value || this.value == 0)) {
            let match = false;
            for (let value in values) {
                if (this.value == values[value]) {
                    match = true;
                    break;
                }
            }
            if (!match) {
                if (typeof this.validation.details[this.key] == 'undefined') {
                    this.validation.error = this.validation.error + 1;
                    this.validation.details[this.key] = (message != '') ? message : this.value + ' is not allowed';
                }
            }
        }
        return this;
    }

    sameAs(key, message = '') {
        let _name = key.charAt(0).toUpperCase() + key.slice(1)
        let name = _name.replace('_', ' ');
        if (this.Request.body[key] !== 0) {
            if ((!this.Request.body[key])) {
                if (typeof this.validation.details[key] == 'undefined') {
                    this.validation.error = this.validation.error + 1;
                    this.validation.details[key] = (message != '') ? message : ((name.length > 0) ? name : key) + ' Field is required'
                }
                return this;
            }
        }

        if (this.value !== this.Request.body[key]) {
            this.validation.error = this.validation.error + 1;
            this.validation.details[this.key] = (message != '') ? message : "Confirm Password didn't match";
        }
        return this;
    }

    format(type, format, custom_message = "") {
        let err = 0;
        if (type == 'array_obj') {
            try {
                this.value = (!Array.isArray(this.value)) ? JSON.parse(this.value) : this.value;
                if (Array.isArray(this.value)) {
                    this.value.every(value => {
                        for (let k in format[0]) {
                            if (format[0][k] == 'int' || format[0][k] == 'integer') {
                                if (isNaN(value[k]) || parseInt(value[k]) != value[k]) {
                                    err = 1;
                                    return false;
                                }
                            }
                        }
                    })
                } else err = 1;
            } catch (e) {
                err = 1;
            }
        }
        if (err == 1) {
            if (typeof this.validation.details[this.key] == 'undefined') {
                let type_name = type;
                this.validation.error = this.validation.error + 1;
                this.validation.details[this.key] = (custom_message != '') ? custom_message : 'Data format should be ' + JSON.stringify(format)
            }
        }
        return this;
    }

    val() {
        let val = this.value;

        this.value = '';
        this.key = '';
        this.typeOfValue = '';
        this.isRequired = false;
        return val;
    }

    /**
     * Validate request data
     * @returns {boolean}
     */
    validate(response_automatic=true) {
        let vs = { ...this.validation };
        let resp = {
            result_code: 1,
            time: moment().tz(Config.timezone).format('YYYY-MM-DD H:m:ss'),
            error: {}
        };
        if (vs.error > 0) {
            if (this.Request.xhr || this.Request.originalUrl.includes('/api/')) {
                resp.error.title = 'Invalid Request Data';
                let message = '';
                let count = 1;
                for (let key in vs.details) {
                    if (count == 1) message += key;
                    else message += ", " + key;
                    count++;
                }
                resp.error.message = message + " " + ((count == 2) ? "is" : 'are') + ' invalid';
                resp.error.details = vs.details;
                if(response_automatic) this.Response.status(400).send(resp);
                else return resp.error;
            } else {
                let errors = {};
                for (let k in vs.details) {
                    errors[k] = vs.details[k];
                }
                this.Request.flash('errors', errors);
                this.Request.flash('old', this.Request.body);
                if(response_automatic) this.Response.redirect(this.Request.header('Referer') || '/');
                else return errors;
            }
        } else {
            return true;
        }
    }
}
