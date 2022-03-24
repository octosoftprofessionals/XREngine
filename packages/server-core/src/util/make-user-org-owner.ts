import {scopeTypeSeed} from "../scope/scope-type/scope-type.seed";
import {Application} from "../../declarations";
import {Params} from "@feathersjs/feathers";

export default async function (userId: string, app: Application, params: Params) {
    try {
        console.log('makeUserOrgOwner')
        let refererHeader = params.headers?.referer
        const organization = await (app.service('organization') as any).Model.findOne({
            where: {
                subdomain: new URL(refererHeader).host
            }
        })
        if (organization && organization.ownerId == null) {
            await app.service('organization').patch(organization.id, {
                ownerId: userId
            })
            scopeTypeSeed.templates.forEach(async (el) => {
                await app.service('scope').create({
                    type: el.type,
                    userId: userId,
                    organizationId: organization.id
                })
            })
        }
    } catch(err) {
        console.log('err', err)
        throw err
    }
}