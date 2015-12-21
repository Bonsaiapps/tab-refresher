/**
 * @author john
 * @version 12/20/15 10:17 PM
 */

import gulp from 'gulp'
import conChangelog from 'gulp-conventional-changelog'

gulp.task(changelog)

function changelog () {
  return gulp.src('changelog.md')
  .pipe(conChangelog({
    preset: 'angular'
  }))
  .pipe(gulp.dest('./'))
}
