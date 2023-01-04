const fs = require('fs'),
    path = require('path'),
    path_link = require("./config")['global'];

allFilesSync = (dir, allfiles = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) allFilesSync(filePath, allfiles)
        else allfiles.push({
            file: file,
            path: filePath
        })
    });
    return allfiles
};
dirMapTree = (dir, fileList = []) => {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        fileList.push(
            fs.statSync(filePath).isDirectory()
                ? { [file]: dirMapTree(filePath) }
                : file
        )
    });
    return fileList
};


loadModel = (model) => {
    let coreModel = require(path_link['model'] + model);
    return new coreModel;
};

loadLibrary = (library) => {
    return require(path_link['library'] + library);
};
loadService = (service) => {
    return require(`../app/services/${service}`);
};
loadConfig = (config) => {
    return require(path_link['config'] + config);
};

loadAppConfig = () => {
    return require(path_link['config_json']);
};

loadMiddleware = (middleware) => {
    return require(path_link['middleware'] + middleware);
};
loadCore = (core) => {
    return require(path_link['core'] + core);
};
loadSystem = (file) => {
    return require(`./${file}`);
};
loadValidator = (req, res) => {
    let validator = require(path_link['validator']);
    return new validator(req, res);
};
controller = (controllerPath) => {
    let split = controllerPath.split("/"),
        path = controllerPath.replace('/' + split[split.length - 1], ''),
        Controller = require(path_link['controller'] + path),
        controller = new Controller();
    return controller[split[split.length - 1]];
};
back = (req, res) => {
    return res.redirect(req.header('Referer') || '/');
}
currentDateTime = (format = 'YYYY-MM-DD H:m:ss') => {
    return moment().tz(Config.timezone).format(format);
}
currentDate = (format = 'YYYY-MM-DD') => {
    return moment().tz(Config.timezone).format(format);
}
