const Controller = require('./Controller');
module.exports = class home extends Controller {

    constructor() {
        super();
    }

    index(Req, Res) {
        let data = {
            Request: Req
        }
        Res.render('pages/index', data);
    }
    dashboard(Req, Res) {
        let data = {
            Request: Req
        }
        Res.render('pages/dashboard', data);
    }
}


