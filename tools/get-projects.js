const gulp = require('gulp');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const queryResources = require('./lib/query-resources');
const loopDir = require('./lib/loop-dir');
const npmPackage = require('../package.json');
const { src, destBuildPath, mtopPath } = require('./lib/path-constants');

let projectList = [];
const projectSrc = src;
const buildPath = destBuildPath;
const backupPrefix = 'backup';
const largerVersion = npmPackage.version.split('.')[0];

/**
* get all project file list 
* @param targetProj:  specify an project name
**/
function getProjectList(targetProj) {
  projectList = loopDir(projectSrc, function(file) {
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    if (targetProj) {
      if (basename === targetProj) {
        return true;
      }
    } else {
      if (ext === '.html') {
        return true;
      }  
    }
    return false;
  });
  
  projectList = projectList.map(function(item) {
    const projectName = path.basename(item, '.html');
    const basicHtmlPath = projectSrc + path.sep + item;
    const htmlContents = fse.readFileSync(basicHtmlPath, {
      encoding: 'utf8',
    });
    const jsPathArr = queryResources(htmlContents, 'script');
    const cssPathArr = queryResources(htmlContents, 'link[rel="stylesheet"]');
    const lessResource = [];
    cssPathArr.forEach(function(item) {
      item = item.replace('.min', '');
      const basename = path.basename(item, '.css');
      const lessPath = path.join(projectSrc, 'less', basename);
      if (fs.existsSync(lessPath)) {
        lessResource.push({
          name: basename,
          path: lessPath + '/**/*.less',
        });
      }
    });
    const jsResource = [];
    jsPathArr.forEach(function(item) {
      item = item.replace('.min', '');
      const basename = path.basename(item, '.js');
      // forece to check index.js 
      const jsPath = path.join(projectSrc, 'original', basename, 'index.js');
      if (fs.existsSync(jsPath)) {
        jsResource.push({
          name: basename,
          path: jsPath,
        });
      }
      
    });
    const project = {
      name: projectName,
      html: projectSrc + path.sep + item,
      less: lessResource,
      js: jsResource,
    };
    return project;
  });
  return projectList;
}

module.exports = getProjectList;
