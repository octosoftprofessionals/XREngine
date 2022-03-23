import { Application } from '../../../declarations'
import { Organization } from './organization.class'
import organizationDocs from './organization.docs'
import hooks from './organization.hooks'
import createModel from './organization.model'

declare module '@xrengine/common/declarations' {
  interface ServiceTypes {
    organization: Organization
  }
}

export default (app: Application): void => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    multi: true
  }

  const event = new Organization(options, app)
  event.docs = organizationDocs
  app.use('organization', event)

  const service = app.service('organization')

  service.hooks(hooks)
}
