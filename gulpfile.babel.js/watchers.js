/**
 * @author john
 * @version 12/21/15 1:39 AM
 */

import gulp from 'gulp'
import {reg, paths} from './conf'
import {babel, statics, staticsSrc} from './build'

reg(watch)


export function watch () {
  gulp.watch(paths.src('**/*.js'), babel)
  gulp.watch(staticsSrc, statics)
}
