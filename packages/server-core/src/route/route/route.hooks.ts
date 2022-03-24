import { iff, isProvider } from 'feathers-hooks-common'

import authenticate from '../../hooks/authenticate'
import restrictScopeAccess from '../../hooks/restrict-scope-access'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate(), iff(isProvider('external'), restrictScopeAccess('routes:write') as any)],
    update: [authenticate(), iff(isProvider('external'), restrictScopeAccess('routes:write') as any)],
    patch: [authenticate(), iff(isProvider('external'), restrictScopeAccess('routes:write') as any)],
    remove: [authenticate(), iff(isProvider('external'), restrictScopeAccess('routes:write') as any)]
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
