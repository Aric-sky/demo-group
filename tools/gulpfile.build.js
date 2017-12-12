const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();
const runSequence = require('gulp-sequence');
const fse = require('fs-extra');
const path = require('path');
const rev = require('gulp-rev');
const util = require('gulp-util');
const argv = require('yargs').argv;
const webpack = require('webpack');
const chalk = require('chalk');
const named = require('vinyl-named');
const branch = require('git-branch');
const hashOutput = require('webpack-plugin-hash-output');
const Server = require('karma').Server;
const getProjects = require('./get-projects');
const md5 = require('./lib/md5');
const loopDir = require('./lib/loop-dir');
const webpackConfig = require('./webpack.config');
const npmPackage = require('../package.json');
const { src, destBuildPath, mtopPath } = require('./lib/path-constants');

const inlineAttr = 'data-inline';
const alicdn = 'https://g.alicdn.com/heyi_h5/onehd/';
const backupPrefix = 'backup';
const largerVersion = npmPackage.version.split('.')[0];

const gulpTask = {
  
  // move config
  changeConfig: function() {
    const basicConfig = path.join(mtopPath, 'config.js');
    const productionConfig = path.join(mtopPath, 'config.production.js');
    let flag = true;
    try {
      fse.copySync(productionConfig, basicConfig);  
    } catch(ew) {
      flag = false;
    }
    return flag;
  },
  
  // 文件备份 备份大版本最近的两次
  backup: function() {
    chalk.green('Backup build resource!');
    const backupList = loopDir(destBuildPath, function(file) {
      return /^backup/.test(file);  
    });
    const versionList = backupList.map(function(item) {
      return parseInt(item.replace(backupPrefix + largerVersion + '.', ''));
    }).sort();

    if (versionList.length >= 2) {
      try {
        const removeTarget = path.join(destBuildPath, backupPrefix + largerVersion + '.' + versionList[0]);
        console.log(removeTarget);
        fse.removeSync(removeTarget);
      } catch (ew) {
        chalk.red('ERROR! Can not remove ' + backupPrefix + largerVersion + versionList[0] + ' directory!');
      }
      versionList.splice(0,1);
    }
    const nextVersion = versionList[0] ? + versionList[0] + 1 : 1;
    const nextTarget = backupPrefix + largerVersion + '.' + nextVersion;
    ['css', 'html', 'js'].forEach(function(item) {
      const targetPath = path.join(destBuildPath, nextTarget, item);
      fse.ensureDirSync(targetPath);
      fse.copySync(path.join(destBuildPath, item), targetPath);
    });
    return function() {};
  },
  
  buildJS: function() {
    const destPath = path.join(destBuildPath, 'js');
    webpackConfig.entry = {};
    const jsSrc = [];
    this.projects.forEach(function(proj) {
      proj['js'].forEach(function(item) {
        const projectName = item['name'];
        webpackConfig.entry[projectName] = item['path'];
        jsSrc.push(item['path']);
      });
    });
    webpackConfig.devtool = undefined;
    // webpackConfig.output.filename = '[name].[chunkhash].min.js';
    webpackConfig.output.path = destBuildPath;
    /*webpackConfig.plugins.push(new hashOutput({
      validateOutput: true,
    }));*/
    return gulp.src(jsSrc)
      .pipe(named())
      .pipe(plugins.webpack(webpackConfig))
      .pipe(gulp.dest(destPath)); 
  },
  // file md5 diff
  __diff: function(type) {
              
  },
  
  buildCSS: function() {
    const lessArr = [];
    const destPath = path.join(destBuildPath, 'css');
    return this.projects.forEach(function(proj) {
      if (proj['less'].length > 0) {
        proj['less'].forEach(function(item) {
          const projectName = item['name'];
          const targetName = projectName + '.min.css';
          console.log(chalk.green(item['path']) + ' ---> ' + chalk.green(targetName));
          return gulp.src(item['path'], {base: "../source/less/"})
            .pipe(plugins.less())
            .pipe(plugins.autoprefixer())
            .pipe(plugins.minifyCss())
            .pipe(plugins.rename(targetName))
            .pipe(gulp.dest(destPath));
        })
      }
    });              
  },
  // insert mt-data-inline scripts and css
  buildHtml: function() {
    const destPath = path.join(destBuildPath, 'html');
    let cdnAlia = alicdn;
    if (this.version) {
      cdnAlia += this.version + '/';
    }
    //cdnAlia += 'build/';
    this.projects.forEach(function(item) {
      const projectName = item['name'];
      const targetHtml = projectName + '.html';
      console.log(chalk.green(item['html']) + ' ---> ' + targetHtml);
      return gulp.src(item['html'])
        .pipe(plugins.cdnify({
          //base: '../build/',
          base: './',
        }))
        .pipe(plugins.inlineSource({
          attribute: inlineAttr,
        }))
        .pipe(plugins.cdnify({
          base: cdnAlia,
        }))
        .pipe(gulp.dest(destPath));
    });
  },
  
  clean: function() {
    //  clear some files  
  },
  // test page 
  runKarma: function(done) {
    let fileList = [];
    if (this.projects.length === 1) {
      fileList = ['./build/html/' + this.projects[0]['name'] + '.html'];
    } else {
      fileList =['./build/html/*.html'];
    }
    new Server({
      configFile: path.join(__dirname, '../karma.conf.js'),
      files: fileList,
      // singleRun: true
    }, function(err) {
      if (err === 0) {
        done();  
      } else {
        done(new util.PluginError('karma', {
            message: 'Page tests failed'
        }));
      }
      
    }).start();      
  },
  
  startServer: function() {
    if (this.projects.length === 1) {
      fileList = ['./build/html/' + this.projects[0]['name'] + '.html'];
    } else {
      fileList =['./build/html/*.html'];
      return;
    }
    const serverPath = './html/' +  this.projects[0]['name'] + '.html';
    const stream = gulp.src(destBuildPath)
    .pipe(plugins.webserver({
      fallback: serverPath,
      directoryListing: false,
      open: true,
    }));
    return stream;
  },
  
  __setTasks: function() {
    const self = this;
    gulp.task('buildCSS', function() {
      return self.buildCSS();
    });
    gulp.task('buildJS', function() {
      return self.buildJS();
    });
    gulp.task('buildHtml', function() {
      return self.buildHtml();
    });
    gulp.task('backup', function() {
      if(self.version && self.projects.length>1) {
        self.backup();
      }
    });
    gulp.task('test', function(done) {
      return self.startServer(done);
    });
    // cancel backup
    return ['buildCSS', 'buildJS', 'buildHtml'];
  },
  
  run: function() {
    const self = this;
    const projectName = argv.name;
    const version = argv.version;
    if (!projectName) {
      this.projects = getProjects();
    } else if(/^[a-zA-Z][a-zA-Z\-_\d]+$/.test(projectName)) {
      this.projects = getProjects(projectName);
    }
    if(/^\d{1}\.\d{1,2}\.\d{1,2}$/.test(version)) {
      this.version = version;
    } else if(version) {
      console.log('Error:' + chalk.red('--version is not correct. (eg:1.0.1)'));
      return;
    }
    const currentBranch = branch.sync();
    if ((currentBranch !== 'master' && currentBranch !== 'develop') && (this.projects && this.projects.length !== 1)) {
      return console.log('Error: ' + chalk.red('This action can only be running at the "develop" and "master" branch!'));
    }
    const tasks = this.__setTasks();
    return tasks;
  }
};
const tasks = gulpTask.run();

gulp.task('build', function(cb) {
  if(Array.isArray(tasks)) {
    runSequence.apply(this, tasks)(cb);
  } else {
    console.log(chalk.blue('Build task do nothing!'));
    console.log('');
    console.log('');
  }
});
