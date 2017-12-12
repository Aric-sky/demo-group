/**
* create a project diretory
* @param name 
*/
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const checkProject = require('./check-project');

const projectRoot = path.join(__dirname, '..', 'source');
module.exports = function(name, type, isForce) {
    if(checkProject(name)) {
        return console.log(chalk.red('ERROR:') + '项目已经存在，请重新命名');
    }
    if (!type) {
        name = name.toLowerCase();
        createHtml(name);
        createJS(name);
        createLess(name);
        console.log(chalk.grey('The project ') + name + chalk.grey(' has been created!'));
        console.log(chalk.grey('Please run:'));
        console.log('gulp --name=' + name)
        return true;
    }
};

function createHtml(name) {
    const filePath = path.join(__dirname, 'static/example.html');
    var contents = fs.readFileSync(filePath , {
      encoding: 'utf-8'
    })
    
    contents = contents.replace(/{{\$name}}/ig, name);
    const target = path.join(projectRoot, name + '.html');
    fs.writeFileSync(target, contents);
};

function createJS(name) {
    const jsRoot = path.join(projectRoot, 'original');
    const hasJSSource = fs.existsSync(path.join(jsRoot, name));
    if (!hasJSSource) {
        const target = path.join(jsRoot, name, 'index.js');
        fs.mkdirSync(path.join(jsRoot, name));
        const contents = `// page: ${name}.js
console.log('test')`;
        fs.writeFileSync(target, contents);
    }
};

function createLess(name) {
    const lessRoot = path.join(projectRoot, 'less');
    const hasLessSource = fs.existsSync(path.join(lessRoot, name));
    if (!hasLessSource) {
        const target = path.join(lessRoot, name, 'index.less');
        fs.mkdirSync(path.join(lessRoot, name));
        const contents = `// page: ${name}.less
@import "../common/reset.less";`;
        fs.writeFileSync(target, contents);
    }
};


