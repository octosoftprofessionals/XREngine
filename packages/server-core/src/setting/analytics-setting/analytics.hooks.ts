import { iff, isProvider } from 'feathers-hooks-common'

import restrictScopeAccess from '../../hooks/restrict-scope-access'

import authenticate from '../../hooks/authenticate'

export default {
  before: {
    all: [authenticate(), iff(isProvider('external'), restrictScopeAccess('super-admin') as any)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
