import { DataTypes, Model, Sequelize } from 'sequelize'

import { OrganizationInterface } from '@xrengine/common/src/dbmodels/Organization'

import { Application } from '../../../declarations'

export default (app: Application) => {
  const sequelizeClient: Sequelize = app.get('sequelizeClient')
  const Organization = sequelizeClient.define<Model<OrganizationInterface>>(
    'organization',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      subdomain: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      hooks: {
        beforeCount(options: any): void {
          options.raw = true
        }
      }
    }
  )
  ;(Organization as any).associate = (models: any): void => {
    ;(Organization as any).hasMany(models.scope, { foreignKey: 'organizationId' })
    ;(Organization as any).hasMany(models.route, { foreignKey: 'organizationId' })
  }

  return Organization
}
