import makeWebpackConfig from './webpack/config'
import webpackBuild from './webpack/build'
import Manifest from './manifest'
import * as paths from './paths'

// Override Webpack hot updater
// overrideHotUpdater()

// Create manifest
const manifest = new Manifest({ manifest: paths.manifest, build: paths.build })
manifest.run()

// Build webpack
const webpackConfig = makeWebpackConfig(manifest)
const building = webpackBuild(webpackConfig)

building.catch((reason) => {
  console.error(clc.red("Building failed"))
  console.error(clc.red(reason.stack))
})
