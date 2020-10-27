import { existsSync } from 'fs'
import { promisify } from 'util'
import { join } from 'path'
import child from 'child_process'

import { PROJECTS } from '../lib/dirs.js'
import { run } from '../lib/spinner.js'

let exec = promisify(child.exec)

let NAMES = [
  'logux-core',
  'logux-server',
  'logux-client',
  'logux-redux',
  'logux-vuex'
]

export default async function installTypes (nextSteps) {
  let dirs = NAMES.map(i => join(PROJECTS, i))
  if (dirs.every(i => existsSync(i))) {
    await Promise.all(nextSteps())
  } else {
    await Promise.all(nextSteps())
    await Promise.all([
      run('Installing Python dependencies', async () => {
        await exec('make venv && make install && pip install -U sphinx', {
          cwd: join(PROJECTS, 'logux-django')
        })
      }),
      run('Installing types dependecies', async () => {
        for (let dir of dirs) {
          await exec('yarn install --production=false', { cwd: dir })
        }
      })
    ])
  }
}
