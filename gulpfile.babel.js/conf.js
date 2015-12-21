import path from 'path'
import gulp from 'gulp'

/**
 * Gulp Build Config
 *
 * @author john
 * @version 12/20/15 10:17 PM
 */

const root = './'
export let resolveSrc = resolveTo('src')
export let resolveDist = resolveTo('lib')

export const paths = {
  src: resolveSrc,
  dist: resolveDist
}



export function reg (...tasks) {
  tasks.forEach(x => gulp.task(x))
}


function resolveTo (route) {
  return baseResolve(root, route)
}


function baseResolve (base, route) {
  return function (glob, not) {
    glob = glob || ''
    if (not) return not + path.join(base, route, glob)
    return path.join(base, route, glob)
  }
}

