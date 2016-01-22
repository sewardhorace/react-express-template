var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');

//directory where the your parent script file lives
var scriptsDir = './src/scripts/';
//destination where you want your bundle to be output
var buildDir = './src/dist/scripts/';

//entryFile is your main script file.  watch is a boolean.
function buildScript(entryFile, watch) {
  
  //browserify options
  var props = {
    entries: [scriptsDir + entryFile],
    debug: true,
    cache: {},
    packageCache: {}
  };
  
  //if 'watch', bundle with watchify, otherwise use regular browserify
  var bundler = watch ? watchify(browserify(props)) : browserify(props);
  
  //use babelify to transform react files (JSX)
  bundler.transform(babelify, {presets: ["react"]});
  
  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', function(e){
      gutil.log(e);
    })
    //name of file to be output
    .pipe(source('bundle.js'))
    //destination for bundled file
    .pipe(gulp.dest(buildDir));
  }
  
  //for watchify; if files are updated, rebundle them automatically
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
}

//run "gulp build" 
gulp.task('build', function() {
  return buildScript('main.js', false);
});

//run "gulp" in a new terminal tab
gulp.task('default', function() {
  return buildScript('main.js', true);
});
