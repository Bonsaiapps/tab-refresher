import fs from 'fs-extra'
import path from 'path'
import _ from 'lodash'
import * as paths from '../../paths'
import * as log from '../log'
import * as Remove from '../../util/remove'

const buildAssetsDir = "$assets"

const processAsset = function (object, key, buildPath) {
  const assetPath = object[key]

  log.pending(`Processing asset '${assetPath}'`)

  // Create directory if not exists
  const buildAssetsDirPath = path.join(buildPath, buildAssetsDir)
  try {
    const buildAssetsDirStats = fs.lstatSync(buildAssetsDirPath);

    if (!buildAssetsDirStats.isDirectory()) {
      fs.mkdirsSync(buildAssetsDirPath)
    }
  } catch (ex) {
    fs.mkdirsSync(buildAssetsDirPath)
  }

  const assetSrcPath = path.join(paths.src, assetPath)
  const buildAssetPath = path.join(buildAssetsDir, Remove.path(assetPath))
  const assetDestPath = path.join(buildPath, buildAssetPath)

  fs.copySync(assetSrcPath, assetDestPath)

  object[key] = buildAssetPath.replace(/\\/g, "/")

  log.done(`Done`)

  return true
}

export default function (manifest, { buildPath }) {

  let { icons = {} } = manifest

  let custom = ["popup/scripts/snapshots-script.js"]

  // Process Icons
  if (_.size(icons))
    _.forEach(icons, (iconPath, name) => processAsset(icons, name, buildPath))


  if (custom.length)
    custom.forEach(script => processScript(script, buildPath))

  return { manifest }
}

function processScript (script, buildPath) {

  log.pending(`Processing script ${script}`)
  const assetSrcPath = path.join(paths.src, script)
  const distPath = path.join(buildPath, script)

  fs.copySync(assetSrcPath, distPath)

  log.done(`Done`)
}



