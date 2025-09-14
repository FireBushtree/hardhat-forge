import type { Express } from 'express'
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre'
import type { ForgeActionArguments } from '../../forge'

export interface CreateApiParams {
  app: Express
  args: ForgeActionArguments
  hre: HardhatRuntimeEnvironment
}
