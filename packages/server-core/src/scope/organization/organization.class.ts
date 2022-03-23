import { SequelizeServiceOptions, Service } from 'feathers-sequelize'

import { OrganizationInterface } from '@xrengine/common/src/dbmodels/Organization'

import { Application } from '../../../declarations'
import {Params} from "@feathersjs/feathers";
import {extractLoggedInUserFromParams} from "../../user/auth-management/auth-management.utils";
import {scopeTypeSeed} from "../scope-type/scope-type.seed";

export type OrganizationDataType = OrganizationInterface

export class Organization<T = OrganizationInterface> extends Service<T> {
  app: Application
  docs: any

  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
    this.app = app
  }

  async create(data: any, params: Params = {}): Promise<T> {
    const org = await super.create(data) as any
    const loggedInUser = extractLoggedInUserFromParams(params)
    if (loggedInUser)
      scopeTypeSeed.templates.forEach(async (el) => {
        await this.app.service('scope').create({
          type: el.type,
          userId: context.arguments[0],
          organizationId: org.id
        })
      })
    return org as T
  }
}
