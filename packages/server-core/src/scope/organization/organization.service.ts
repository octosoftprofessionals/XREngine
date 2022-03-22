import { Application } from '../../../declarations'
import { Scope } from './organization.class'
import scopeDocs from './organization.docs'
import hooks from './organization.hooks'
import createModel from './organization.model'

declare module '@xrengine/common/declarations' {
  interface ServiceTypes {
    scope: Scope
  }
}

export default (app: Application): void => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  const event = new Scope(options, app)
  event.docs = scopeDocs
  app.use('scope', event)

  const service = app.service('scope')

  service.hooks(hooks)
}
