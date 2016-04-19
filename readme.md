
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

# Tab Refresher - Chrome Extension

**All commands are run from project root directory**

All work should be done on the develop branch, including commands below.

### Dev Setup
- `./bin/install.sh`

### Build Project
- `npm run build`

### Incremental Builds
- `npm run dev`

### Create Release/Tag
- Commit and push any changes to develop
- `./bin/release.sh`
  - Release script can take an argument, "patch" is default. Options are (patch|minor|major) for determining how to bump the versions
  `./bin/release.sh major` would set versions and new tag from `0.0.5` to `1.0.0`


### Todo
- [ ] Network status
