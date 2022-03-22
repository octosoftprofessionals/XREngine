export default {
  definitions: {
    scope: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: ''
        },
        name: {
          type: 'string',
          description: ''
        },
        subdomain: {
          type: 'string',
          description: ''
        }
      }
    },
    organization_list: {
      type: 'array',
      items: { $ref: '#/definitions/organization' }
    }
  }
}
