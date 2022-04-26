const removeSecret = (data) => {
    for(let key in data){
        if(key.includes('password')) data[key] = '********';
    }
    return data;
}
exports.requestlog = async (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            let body = { ...req.body };
            body = removeSecret(body);

            let data = {
                time: new Date().toString(),
                path: req.path,
                params: JSON.stringify(req.params),
                query_params: JSON.stringify(req.query),
                body: JSON.stringify(body),
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                "user-agent": req.get('user-agent')
            }
            let file_path = './logs/' + currentDate() + '-user-request.log'
            let fs = require('fs');
            fs.appendFile(file_path, JSON.stringify(data) + "\n", null, function (err, data) {
                if (err) reject(err)
                else resolve(file_path)
            });
        } catch (err) {
            reject(err)
        }
    })
}