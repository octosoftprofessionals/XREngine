import { iff, isProvider } from 'feathers-hooks-common'

import restrictScopeAccess from '../../hooks/restrict-scope-access'

import authenticate from '../../hooks/authenticate'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [authenticate(), iff(isProvider('external'), restrictScopeAccess('super-admin') as any)],
    update: [authenticate(), iff(isProvider('external'), restrictScopeAccess('super-admin') as any)],
    patch: [authenticate(), iff(isProvider('external'), restrictScopeAccess('super-admin') as any)],
    remove: [authenticate(), iff(isProvider('external'), restrictScopeAccess('super-admin') as any)]
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
