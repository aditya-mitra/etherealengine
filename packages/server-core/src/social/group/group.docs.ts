/**
 * An object for swagger documentation configuration
 */
export default {
  definitions: {
    group: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        }
      }
    },
    group_list: {
      type: 'array',
      items: { $ref: '#/definitions/group' }
    }
  },
  securities: ['create', 'update', 'patch', 'remove'],
  operations: {
    find: {
      security: [{ bearer: [] }]
    }
  }
}
