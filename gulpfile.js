/**
 * Created by liupf on 2015/9/10.
 */
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    browserSync = require('browser-sync'),
    babel = require('gulp-babel'),
    runSequence =  require('gulp-sequence'),
    through = require('through-gulp'),
    fs = require('fs'),
    rev = require('gulp-rev'),
    cdnify = require('gulp-cdnify'),
    argv = require('yargs').argv,
    checkProject = require('./tools/check-project'),
    create = require('./tools/create-tpl'),
    webpack = require('webpack');
    

require('./tools/gulpfile.build');
/**
 * 路径
 * */
const commonJSLib = './source/common/**/*.js';

var path = {
    source: [
        './source/*.html',
        './source/html/*.html',
        './source/css/*.css',
        './source/js/*.js'
    ],
    build: [
        './build/*.html',
        './build/html/*.html',
        './build/css/*.css',
        './build/js/*.js'
    ],
    sourcePath:{
        files:{
            css:"source/css/*.css",
            js:["source/js/*.js"],
            original:"source/original/*.js",
            less:"source/less/*.less",
            libs:"source/libs/*",/*
            images:"source/images/*.*",*/
            html:"source/*.html"
        },
        dests:{
            css:"source/css",
            js:"source/js",
            original:"source/original",
            libs:"build/libs",
            less:"source/less",/*
            images:"source/images",*/
            html:"source"
        }
    },
    buildPath:{
        files:{
            css:"build/css/*.css",
            js:"build/js/*.js",/*
            images:"build/images/*.*",*/
            libs:"build/libs/*.js",
            html:"build/*.html"
        },
        dests:{
            css:"build/css",
            js:"build/js",/*
            images:"build/images",*/
            libs:"build/libs",
            html:"build"
        }

    },
    baseDir: "./",
    cdn:"http://m.youku.com/h5/"
};
/**
 * 任务对象
 * */
var TASKS = {
    changeJSArr:[],  //记录js变动数组
    changeCssArr:[], //记录css变动数组
    uglify_Arr:[],   //记录js/css压缩任务名字数组
    watch_Arr:[],    //记录观察js/css任务名字数组
    compareJsArr:[], //记录有改变的js的MD5和复制到build文件的任务的名字的数组
    compareCssArr:[],//记录有改变的js的MD5和复制到build文件的任务的名字的数组
    readFs:function(_path,suffix,callback){
        var scope=this,files = fs.readdirSync(_path);
        if(files){
            files.forEach(function(item) {
                if(item==".svn"||item==".DS_Store")return;
                var tmpPath = _path + '/' + item+"/**/*."+suffix;
                gulp.task(suffix+'_uglify_'+item, function () {
                    if(suffix=="js"){
                        callback(tmpPath,path.sourcePath.dests[suffix],item+".min."+suffix);
                    }else if(suffix=="less"){
                        callback(tmpPath,path.sourcePath.dests["css"],item+".min.css");
                    }
                });
                scope.uglify_Arr.push(suffix+'_uglify_'+item);

                gulp.task(suffix+'_watch_'+item, function () {
                    plugins.watch(tmpPath, function () {
                        gulp.start(suffix+'_uglify_'+item);
                    });
                });
                scope.watch_Arr.push(suffix+'_watch_'+item);
            });
        }else{
            console.log('read dir error');
        }
    },
    distributeTask: function(_path,item,suffix,callback){
        var scope = this;
        var tmpPath = _path + '/' + item+"/**/*."+suffix;

        gulp.task(suffix+'_uglify_'+item, function () {
            if(suffix=="js"){
                callback(tmpPath,path.sourcePath.dests[suffix],item+".min."+suffix);
            }else if(suffix=="less"){
                callback(tmpPath,path.sourcePath.dests["css"],item+".min.css");
            }
        });
        scope.uglify_Arr.push(suffix+'_uglify_'+item);

        gulp.task(suffix+'_watch_'+item, function () {
            plugins.watch(tmpPath, function () {
                gulp.start(suffix+'_uglify_'+item);
            });
        });
        scope.watch_Arr.push(suffix+'_watch_'+item);

        if(suffix=="js"){
            
            gulp.task("js_watch_common", function () {
                plugins.watch(commonJSLib, function () {
                    gulp.start(suffix+'_uglify_'+item);
                });
            });
            scope.watch_Arr.push("js_watch_common");
        }

    },
    buildJs:function(file,dest,name){
        return gulp.src(file)
            .pipe(plugins.webpack({
                devtool: "source-map",
                output: {
                    filename: name
                },
                module:{
                    loaders: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: "babel"
                        },
                        {
                            test: /\.css?$/,
                            loaders: [ 'style', 'raw' ],
                            include: __dirname
                        }
                    ]
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        minimize: true,
                        compress: {
                            warnings: false
                        },
                        mangle: {
                            except: ['$super', '$', 'exports', 'require']
                        }
                    }),
                    new webpack.DefinePlugin({
                        "process.env": {
                            NODE_ENV: JSON.stringify("production")
                        }
                    }),
                    new webpack.optimize.OccurenceOrderPlugin(),
                    //new webpack.HotModuleReplacementPlugin(),
                    new webpack.NoErrorsPlugin()
                ]
            }))
            .pipe(gulp.dest(dest));
    },
    buildCss:function(file,dest,name){
        return  gulp.src(file)
            .pipe(plugins.less())
            .pipe(plugins.autoprefixer())
            /*.pipe(plugins.rename({suffix: '.min'}))*/
            .pipe(plugins.minifyCss())
            .pipe(plugins.concat(name))
            .pipe(gulp.dest(dest));
    },
    cleanSource:function(){
        gulp.task('clean', function () {
            return gulp.src([path.sourcePath.dests.css+"/"+argv.name+".min.css", path.sourcePath.dests.js+"/"+argv.name+".min.js","source/js/*.map"], {read: false})
                .pipe(plugins.clean());
        });
    },
    md5:function(data){
        var Buffer = require("buffer").Buffer,
            buf = new Buffer(data),
            str = buf.toString("binary"),
            crypto = require("crypto");
        return crypto.createHash("md5").update(str).digest("hex").substr(0,10);
    },
    inArray:function(arr, item){
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    },
    compareJs:function(){
        var scope = this,
            S_files = fs.readdirSync(path.sourcePath.dests.js),
            B_files = fs.readdirSync(path.buildPath.dests.js);

        if(S_files&&B_files){
            if(S_files.length==0){
                console.log("not found source js");
            }else{
                S_files.forEach(function(item_outer,i) {
                    if(item_outer.length-3!=item_outer.lastIndexOf(".js"))
                    return;
                    if(!argv.name)return;
                    var regname =  new RegExp((argv.name).replace(",","|"));
                    if(!regname.test(item_outer))return;

                    var _path = path.sourcePath.dests.js+"/"+item_outer,
                        rev_path = "source/rev/js/"+item_outer;
                    var md5_name = scope.md5(fs.readFileSync(_path)),
                        md5_name = item_outer.substr(0,item_outer.length-7)+"-"+md5_name+".min.js";
                    if(!scope.inArray(B_files,md5_name)){
                        scope.changeJSArr.push(md5_name);
                        gulp.task("compare_js"+i,function(){
                                return  gulp.src(_path)
                                        .pipe(gulp.dest(path.buildPath.dests.js));
                        });
                        scope.compareJsArr.push("compare_js"+i);
                    }
                });
                if(scope.changeJSArr.length==0){
                    console.log("source js not change");
                }else{
                    console.log(scope.changeJSArr.join(",")+" is changed");
                }
            }
        }else{
            console.log('read dir error');
        }
    },
    compareCss:function(){
        var scope = this,
            S_files = fs.readdirSync(path.sourcePath.dests.css),
            B_files = fs.readdirSync(path.buildPath.dests.css);

        if(S_files&&B_files){
            if(S_files.length==0){
                console.log("not found source css");
            }else{
                S_files.forEach(function(item_outer,i) {
                    if(item_outer.length-4!=item_outer.lastIndexOf(".css"))
                    return;
                    if(!argv.name)return;
                    var regname =  new RegExp((argv.name).replace(",","|"));
                    if(!regname.test(item_outer))return;

                    var _path = path.sourcePath.dests.css+"/"+item_outer,
                        rev_path = "source/rev/css/"+item_outer;
                    var md5_name = scope.md5(fs.readFileSync(_path)),
                        md5_name = item_outer.substr(0,item_outer.length-8)+"-"+md5_name+".min.css";
                    if(!scope.inArray(B_files,md5_name)){
                        scope.changeCssArr.push(md5_name);
                        var times = new Date().valueOf();
                         gulp.task("compare_css"+i,function(){
                                return  gulp.src(_path)
                                        .pipe(gulp.dest(path.buildPath.dests.css));
                        });
                        scope.compareCssArr.push("compare_css"+i);
                    }
                });
                if(scope.changeCssArr.length==0){
                    console.log("source css not change");
                }else{
                    console.log(scope.changeCssArr.join(",")+" is changed");
                }
            }
        }else{
            console.log('read dir error');
        }
    },
    buildHtml:function(htmlName){
       return   gulp.src(['source/rev/**/**/*.json', 'source/'+htmlName+'.html'])
                .pipe( plugins.revCollector({
                    replaceReved: true
                }) )
                .pipe( plugins.minifyHtml({
                    empty:true,
                    spare:true
                }) )
            //    .pipe(cdnify({
            //        rewriter: function(url) {
            //            if (/http:/.test(url)) {
            //                return url;
            //            }else {
            //                return path.cdn+url;
            //            }
            //        }
            //    }))
                .pipe( gulp.dest(path.buildPath.dests.html) );
    },
    loadOnline:function(){
        this.compareJs();
        this.compareCss();
        gulp.task('copy',function () {
                /*gulp.src(path.sourcePath.files.images)
                    .pipe(gulp.dest(path.buildPath.dests.images));*/

                gulp.src(path.sourcePath.files.libs)
                    .pipe(gulp.dest(path.buildPath.dests.libs));
        });
    },
    //gulp --name=yksmartbanner,star --p=1 --hname=video
    startTask:function(){
        if(argv['_'][0] === 'build') {
          return;
        }
        var scope = this,
            files="";
        if(!argv.name){
            console.log("project name is must");
            return;
        }
        if(argv.p){//生产环境
            files = path.build;
        }else{//非生产环境
            files = path.source;
        }
        var port = 80;
        if (argv.port && argv.port > 0) {
          port = argv.port;
        }
        browserSync.init(files, {
            server: {
                baseDir: path.baseDir
            },
            //停止自动打开浏览器
            open: false,
            port: port,
        });
        
        if(argv.p){
            scope.loadOnline();
            gulp.task('online', function () {
                if((scope.changeJSArr&&scope.changeJSArr.length>0)||(scope.changeCssArr&&scope.changeCssArr.length>0)){
                    if(argv.hname){
                        var _hnameArr = argv.hname.split(",");
                        for(var i = 0; i < _hnameArr.length; i++){
                            scope.buildHtml(_hnameArr[i]);
                        }
                    }
                }else{
                    console.log("no change");
                }
            });
            gulp.task('compare', function (cb) {
                if(scope.compareJsArr.length>0&&scope.compareCssArr.length>0){
                    runSequence(scope.compareJsArr,scope.compareCssArr, cb);
                }else if(scope.compareJsArr.length>0&&scope.compareCssArr.length==0){
                    runSequence(scope.compareJsArr, cb);
                }else if(scope.compareJsArr.length==0&&scope.compareCssArr.length>0){
                    runSequence(scope.compareCssArr, cb);
                }
            });
            gulp.task('default', runSequence("compare","copy","online"));
        }else{
            scope.cleanSource();
            // scope.readFs(path.sourcePath.dests.original,"js",scope.buildJs);
            // scope.readFs(path.sourcePath.dests.less,"less",scope.buildCss);
            scope.distributeTask(path.sourcePath.dests.original,argv.name,"js",scope.buildJs);
            scope.distributeTask(path.sourcePath.dests.less,argv.name,"less",scope.buildCss);
            gulp.task('uglify', runSequence(scope.uglify_Arr,scope.watch_Arr));
            gulp.task('default', runSequence("clean", "uglify"));
        }
    }
};

TASKS.startTask();
