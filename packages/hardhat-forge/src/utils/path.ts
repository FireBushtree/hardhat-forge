import path from 'node:path'
import type { HardhatRuntimeEnvironment } from 'hardhat/types/hre'

export function getArtifactsPath(hre: HardhatRuntimeEnvironment) {
  return hre.config.paths.artifacts
}

export function getIgnitionPath(hre: HardhatRuntimeEnvironment) {
  return path.join(hre.config.paths.root, 'ignition')
}

export function getIgnitionModulesPath(hre: HardhatRuntimeEnvironment) {
  return path.join(getIgnitionPath(hre), 'modules')
}

export function getIgnitionDeploymentsPath(hre: HardhatRuntimeEnvironment) {
  return path.join(getIgnitionPath(hre), 'deployments')
}
