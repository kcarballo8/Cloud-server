const path = require('path');
function projectPath(...rel) { return path.join(__dirname, '..', ...rel) };


module.exports ={
    hostPort: 8000,

    //loglevel
    logLevel: 'dev',

    //cloud directory
    cloudDir: projectPath('cloudFiles'),

    sessionOptions : {
        secret: 'bunnyslippers',
        saveUninitialized : false,
        resave: false
    },

    projectPath,
};
