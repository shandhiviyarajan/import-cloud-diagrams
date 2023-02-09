var connect_lr = require("connect-livereload"),
  express = require("express"),
  include = require("gulp-include"),
  app = express(),
  path = require("path"),
  cors = require('cors');
  express_port = 9705,
  express_root = path.resolve(".express"),
  gulp = require("gulp"),
  live_reload_port = 35730,
  live_reload_server = require("tiny-lr")(),
  plugins = require("gulp-load-plugins")(),
  concat = require("gulp-concat"),
  del = require("del"),
  gutil = require("gulp-util"),
  eslint = require('gulp-eslint'),
  stylelint  = require('gulp-stylelint'),
  svgstore = require('gulp-svgstore'),
  svgmin = require('gulp-svgmin'),
  rename = require('gulp-rename'),
  inject = require('gulp-inject'),
  webpack = require("webpack");

console.log("http://localhost:" + express_port);

const webpackConfig = require(`./webpack.prod.config.js`);
const webpackThreeConfig = require(`./webpack.three.config.js`);

var src = "src";
var dist = "dist";

const env = process.env.NODE_ENV;

const build_dir = env === "prod" ? "_build" : dist;

var paths = {
  js: src + "/**/*.js",
  scss: src + "/designer.scss",
  fonts: src + "/designer.fonts.scss",
  html: src + "/**/*.html",
};

gulp.task("combine-js", function () {
  return gulp
    .src(paths.js)
    .pipe(concat("hava.designer.js"))
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(build_dir))
    .on("error", plugins.util.log);
});

gulp.task("bundle", (done) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    } else {
      gutil.log("[webpack]", stats.toString());
    }
    done();
  });
});

gulp.task("compile-sass", function () {
  return gulp
    .src(paths.scss)
    .pipe(concat("hava.designer.css"))
    .pipe(plugins.plumber())
    .pipe(
      plugins.sass()
    )
    .pipe(concat("_hava.designer.compiled.scss"))
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(dist))
    .on("error", plugins.util.log);
});

gulp.task("isolate", gulp.series("compile-sass", function () {
  return gulp
    .src('src/hava.designer.wrapper.scss')
    .pipe(concat("hava.designer.css"))
    .pipe(plugins.plumber())
    .pipe(
      plugins.sass()
    )
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(dist))
    .on("error", plugins.util.log);
}));

gulp.task("compile-fonts", function () {
  return gulp
    .src(paths.fonts)
    .pipe(concat("hava.designer.fonts.css"))
    .pipe(plugins.plumber())
    .pipe(plugins.sass())
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(dist))
    .on("error", plugins.util.log);
});

gulp.task('compile-svg', function () {
  return gulp
  .src('assets/icons/**/*.svg')
  .pipe(rename(function (file) {
    var name = file.dirname.split(path.sep);
    name.push(file.basename);
    file.basename = name.join('-');
  }))
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      },
        { removeViewBox: false}]
    }
  }))
  .pipe(svgstore())
  .pipe(rename("hava.designer.icons.svg"))
  .pipe(gulp.dest(build_dir));
});

gulp.task("compress-html", gulp.series("compile-svg", function () {
  return gulp
    .src(paths.html)
    .pipe(inject(gulp.src(build_dir + "/hava.designer.icons.svg"), {
      starttag: '<!-- inject:svg -->',
      quiet: true,
      transform: function(filePath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(
      plugins.angularTemplatecache({
        root: "/designer",
        module: "designer",
      })
    )
    .pipe(concat("hava.designer.templates.js"))
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(dist))
    .on("error", plugins.util.log);
}));

gulp.task("compile-vendor", function () {
  return gulp
    .src("vendor.js")
    .pipe(include())
    .pipe(concat("hava.designer.vendor.js"))
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(dist))
    .on("error", plugins.util.log);
});

// --> Start prod specific tasks

gulp.task("bundle", gulp.series("combine-js", (done) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    } else {
      gutil.log("[webpack]", stats.toString());
    }
    done();
  });
}));

gulp.task("compile-rest", function () {
  return gulp
    .src("vendor_rest.js")
    .pipe(include())
    .pipe(concat("hava.designer.rest.js"))
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(build_dir))
    .on("error", plugins.util.log);
});

gulp.task("webpack-three", function (done) {
  webpack(webpackThreeConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    } else {
      gutil.log("[webpack]", stats.toString());
    }
    done();
  });
});

gulp.task("combine-vendors", gulp.series("webpack-three", "compile-rest", function () {
  return gulp
    .src([
      `${build_dir}/hava.designer.rest.js`,
      `${build_dir}/hava.designer.three.js`,
    ])
    .pipe(concat("hava.designer.vendor.js"))
    .pipe(plugins.size({ showFiles: true }))
    .pipe(gulp.dest(dist))
    .on("error", plugins.util.log);
}));

// --> End of prod specific tasks

gulp.task("clean", function () {
  del(["_build", express_root]);
  return del(["dist", express_root]);
});

gulp.task('lint', function() {
  return gulp.src(['src/*.js'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});

gulp.task('lint-css', function lintCssTask() {
  return gulp.src('src/**/*.scss')
  .pipe(stylelint({
    reporters: [
      { formatter: 'string', console: true }
    ]
  }));
});

function live_reload_notify(file) {
  live_reload_server.changed({ body: { files: [file] } });
}

if (env === "prod") {
  gulp.task("build", gulp.series(
    "combine-vendors",
    "bundle",
    "compile-fonts",
    "isolate",
    "compress-html"
  ));
} else {
  gulp.task("build", gulp.series(
    "combine-vendors",
    "combine-js",
    "compile-fonts",
    "isolate",
    "compress-html"
  ));
}

gulp.task("watch", gulp.series("build", function () {
  app.use(cors());
  app.use(
    connect_lr({
      port: live_reload_port,
    })
  );
  app.use("/", express.static(__dirname));
  app.listen(express_port);

  live_reload_server.listen(live_reload_port, function (err) {
    if (err) {
      return console.log(err);
    }

    // Gulp should bundle if environment is prod
    const prod_task = env === "prod" ? "bundle" : "combine-js";

    gulp.watch("gulpfile.js",  gulp.series("build"));
    gulp.watch(paths.js,  gulp.series(prod_task));
    gulp.watch(paths.scss,  gulp.series("isolate"));
    gulp.watch(paths.fonts,  gulp.series("compile-fonts"));
    gulp.watch(paths.html,  gulp.series("compress-html"));

    gulp.watch(dist + "/**").on("change", live_reload_notify);
    gulp.watch("**.html").on("change", live_reload_notify);
  });
}));

gulp.task("default", gulp.series("watch"));
