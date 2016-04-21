import path from 'path'

const SRC = 'src'
const RELEASE = 'dist'
const BUILD = 'lib'

export const root = path.normalize(path.join(__dirname, ".."))

export const packageJson = path.normalize(path.join(root, "package.json"))

export const src = path.normalize(path.join(root, SRC))

export const release = path.normalize(path.join(root, RELEASE))

export const build = process.env.NODE_ENV == "development"
  ? path.normalize(path.join(root, BUILD))
  : path.normalize(path.join(release, BUILD))

export const manifest = path.normalize(path.join(src, "manifest.json"))
