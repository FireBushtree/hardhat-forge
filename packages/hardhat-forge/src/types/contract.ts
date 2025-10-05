// TODO: add type detail
export type Artifact = any

export interface Contract {
  name: string
  isDeployed: boolean
  artifact: Artifact
}
