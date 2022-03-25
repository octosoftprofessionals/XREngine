import {HookContext} from '@feathersjs/feathers'

import config from '../appconfig'
import {UserDataType} from '../user/user/user.class'
import {Op} from 'sequelize'

// Get the logged in user entity
const loggedInUserEntity: string = config.authentication.entity

// This will attach the owner ID in the contact while creating/updating list item
export default (scope: string) => {
    return async (context: HookContext): Promise<HookContext> => {
        // console.log('restrict user role', context.params)
        if (context.params.isInternal) return context
        // Getting logged in user and attaching owner of user
        const loggedInUser = context.params.user as UserDataType
        try {
            const matchingScope = await (context.app.service('scope') as any).Model.findOne({
                where: {
                    userId: loggedInUser.id,
                    [Op.or]: [
                        {
                            [Op.and]: [{
                                type: scope,
                            }, {
                                organizationId: context.params.organization.id
                            }]
                        }, {
                            [Op.and]: [{
                                type: 'super-admin',
                            }, {
                                organizationId: 'bab45010-aa1f-11ec-bdec-11299f03b250'
                            }]
                        }
                    ]
                }
            })
            if (!matchingScope)
                throw new Error(`Must have scope ${scope} on organization ${context.params.organization.name} (${context.params.organization.id} to access this function`)

            return context
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}
