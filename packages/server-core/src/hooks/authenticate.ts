import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'

import config from '../appconfig'
import { Application } from '../../declarations'

const { authenticate } = authentication.hooks

export default () => {
  return async (context: HookContext<Application>): Promise<HookContext> => {
    const { params } = context

    if (!context.params) context.params = {}
    const authHeader = params.headers?.authorization
    let originHeader = context.params.headers?.origin
    let refererHeader = context.params.headers?.referer
    let authSplit
    if (authHeader) authSplit = authHeader.split(' ')
    let token, user
    if (authSplit) token = authSplit[1]
    if (token) {
      const key = await context.app.service('user-api-key').Model.findOne({
        where: {
          token: token
        }
      })
      if (key != null)
        user = await context.app.service('user').Model.findOne({
          where: {
            id: key.userId
          }
        })
    }
    if (user) {
      context.params.user = user
      return context
    }
    context = await authenticate('jwt')(context as any)
    context.params.user = context.params[config.authentication.entity]
      ? await context.app.service('user').Model.findOne({
          where: {
            id: context.params[config.authentication.entity].userId
          }
        })
      : {}
    if (originHeader) context.params.organization = await (context.app as Application).service('organization').Model.findOne({
      where: {
        subdomain: new URL(originHeader).host
      }
    })
    if (!originHeader && refererHeader) {
      console.log('Getting organization from refererHeader', refererHeader)
      context.params.organization = await (context.app as Application).service('organization').Model.findOne({
        where: {
          subdomain: new URL(refererHeader).host
        }
      })
    }
    return context
  }
}
