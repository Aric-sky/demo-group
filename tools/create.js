const create = require('./create-tpl');
var projectName = process.argv[2];
if (projectName) {
    create(projectName);
}