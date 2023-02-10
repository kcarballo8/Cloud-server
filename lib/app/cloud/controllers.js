const fs = require('fs').promises;
const path = require('path');
const config = require('../../config');

function sorting (param){
    param.sort(function(a,b) {
        let x = a.toLowerCase(),
            y = b.toLowerCase();
        if (x < y) { return -1; }
        if (y < x) { return 1; }
        return 0;
    });
    return param;
}

async function fileExists(req, res, next){
    console.log(req.originalUrl);
    let temp = config.cloudDir + req.path.replace('/../', '/');
    res.locals.temp = temp;
    try{
        let stats = await fs.stat(temp);
        res.locals.stats = stats;
        if (stats.isDirectory()) {
            if (!req.originalUrl.match(/\/(\?|$)/)) {
                res.redirect(307, req.originalUrl + '/');
            }
        }
        next();
    }
    catch(err){
        res.status(404).send('<h1>Page not found</h1>');
        // next();
    }
}

async function isDir(req, res){
    try{

        if (res.locals.stats.isDirectory()) {
                let contents = await fs.readdir(res.locals.temp);
                let directories = []; let files = []; let promises = [];
                
                try{
                    for (let entry of contents) {
                        promises.push(await fs.stat(path.join(res.locals.temp, entry)));
                    }
                }
                catch(err){
                        console.log("this is the error of the promise: " + err);
                }
                let stats = await Promise.all(promises);
                for (let i = 0; i < contents.length; ++i) {
                    if (stats[i].isDirectory()) { directories.push(contents[i]);}
                    else { files.push(contents[i]); }
                }
                sorting(directories);
                sorting(files);
            
                res.render('template.hbs', {contents: contents, directories: directories, files: files, path: req.path}); 
        }
        else {
            if('download' in req.query) {
                //res.type('text/html');
                res.download(res.locals.temp);
            }
            else {
                res.sendFile(res.locals.temp);
            }
        }
    }
    catch(err){
    }
}

async function uploadFile(req, res) {
    try{
        //temp is to remove upload from url
        let tempPath = req.path.replace("upload", "");
        await fs.rename(req.file.path, path.join(config.cloudDir, tempPath, req.file.originalname));
        tempPath = req.originalUrl.replace("upload", "");
        res.redirect(303, '.');
    }
    catch(err) {
        res.redirect(303, '.');
    }
}

module.exports= {fileExists, uploadFile, isDir};