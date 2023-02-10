const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const sessionFileStore = require('session-file-store');
const expressHandlebars = require('express-handlebars');
const config = require('../config');
const cloud = require('./cloud');

//Create custom file store class
const FileStore = sessionFileStore(expressSession);

const app = express();
app.engine('hbs', expressHandlebars.engine({ defaultLayout: null, extname: '.hbs' }));

//Logging
if(config.logLevel) {
    app.use(morgan(config.logLevel));
}

//Request bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//sessions
// app.use(expressSession({
//     ...config.sessionOptions,
//     store: new FileStore(),
// }));

//mount features
app.use('/cloud', cloud.router );

module.exports = app; 