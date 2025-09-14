import type { NewTaskActionFunction } from 'hardhat/types/tasks'
import { createServer } from './server'

export type ForgeActionArguments = {
  port?: string
}

const forgeAction: NewTaskActionFunction<ForgeActionArguments> = async (
  args,
  hre,
) => {
  createServer(args, hre)
}

export default forgeAction
