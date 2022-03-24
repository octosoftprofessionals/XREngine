import { iff, isProvider } from 'feathers-hooks-common'

import restrictScopeAccess from '../../hooks/restrict-scope-access'

import authenticate from '../../hooks/authenticate'

export default {
  before: {
    all: [authenticate()],
    find: [],
    get: [iff(isProvider('external'), restrictScopeAccess('super-admin') as any)],
    create: [iff(isProvider('external'), restrictScopeAccess('super-admin') as any)],
    update: [iff(isProvider('external'), restrictScopeAccess('super-admin') as any)],
    patch: [iff(isProvider('external'), restrictScopeAccess('super-admin') as any)],
    remove: [iff(isProvider('external'), restrictScopeAccess('super-admin') as any)]
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
