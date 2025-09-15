import type { NewTaskActionFunction } from 'hardhat/types/tasks'

export type ForgeActionArguments = {
  port?: string
}

const forgeAction: NewTaskActionFunction<ForgeActionArguments> = async (
  args,
  hre,
) => {
  console.log(123)
}

export default forgeAction
