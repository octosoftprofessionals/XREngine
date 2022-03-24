import { iff, isProvider } from 'feathers-hooks-common'

import authenticate from '../../hooks/authenticate'
import restrictScopeAccess from '../../hooks/restrict-scope-access'

export default {
  before: {
    all: [authenticate()],
    find: [],
    get: [iff(isProvider('external'), restrictScopeAccess('instance:read') as any)],
    create: [iff(isProvider('external'), restrictScopeAccess('instance:write') as any)],
    update: [iff(isProvider('external'), restrictScopeAccess('instance:write') as any)],
    patch: [iff(isProvider('external'), restrictScopeAccess('instance:write') as any)],
    remove: [iff(isProvider('external'), restrictScopeAccess('instance:write') as any)]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
} as any
