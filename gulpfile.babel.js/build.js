/**
 * @author john
 * @version 12/21/15 12:58 AM
 */

import gulp from 'gulp'
import gulpBabel from 'gulp-babel'
import gnf from 'gulp-npm-files'
import {paths, reg} from './conf'


reg(babel, statics, vendors)
gulp.task('build', gulp.parallel(babel, statics, vendors))


export function babel () {
  let src = [
    paths.src('**/*.js'),
    paths.src('vendor/**/*.js', '!')
  ]
  return gulp.src(src)
    .pipe(gulpBabel({
      presets: ["es2015", "stage-0"]
    }))
    .pipe(gulp.dest(paths.dist('')))
}

export const staticsSrc = [
  paths.src('**/*.png'),
  paths.src('**/*.html'),
  paths.src('**/*.css'),
  paths.src('**/fonts/*.*'),
  paths.src('**/vendor/**/*.js')
]
export function statics () {

  return gulp.src(staticsSrc)
    .pipe(gulp.dest(paths.dist('')))
}


export function vendors () {
  return gulp.src(gnf(null, '', {includeDist: true}), {base: './'})
    .pipe(gulp.dest(paths.dist('')))
}
