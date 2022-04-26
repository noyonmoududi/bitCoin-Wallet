require('./system/require');
// configure the app for post request data convert to json
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(flash());

//view config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.use(express.static(__dirname + "/resources"));
// end view config

app.disable('x-powered-by');

const request_middleware = require('./app/middleware/request')
app.use(request_middleware)
app = require('./system/route-init')(app);

//exception handle
app.use(function (err, req, res, next) {
    if (err.type == 'entity.too.large') ApiErrorResponse(res, 'TOO_LARGE_REQUEST_ENTITY');
    if (err.type == 'entity.parse.failed') ApiErrorResponse(res, 'INVALID_JSON_BODY');
    else {
        console.log('Catch in global error handler app.js:', err)
        ApiErrorResponse(res, 'SOMETHING_WENT_WRONG');
    }
})

exports.app = app;