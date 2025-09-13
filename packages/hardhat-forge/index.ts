import { task } from 'hardhat/config'
import type { HardhatPlugin } from 'hardhat/types/plugins'

const hardhatPlugin: HardhatPlugin = {
  id: 'builtin:forge',
  tasks: [
    task('forge', 'Start a local blockchain scan')
      .setAction(() => import('./src/forge.js'))
      .build(),
  ],
}
export default hardhatPlugin
