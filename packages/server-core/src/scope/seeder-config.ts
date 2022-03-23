import { ServicesSeedConfig } from '@xrengine/common/src/interfaces/ServicesSeedConfig'

import { organizationSeed } from './organization/organization.seed'
import { scopeTypeSeed } from './scope-type/scope-type.seed'

export const scopeSeeds: Array<ServicesSeedConfig> = [organizationSeed, scopeTypeSeed]

export default scopeSeeds
