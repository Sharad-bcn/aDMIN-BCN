import handler from 'api/handler'

const prefix = '/admin/adminControls'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  update: args => handler({ method: 'put', url: prefix + '/update', args }),
  changePin: args => handler({ method: 'put', url: prefix + '/changePin', args }),
  fetchAll: args => handler({ method: 'get', url: prefix + '/fetchAll', args }),
  delete: args => handler({ method: 'delete', url: prefix + '/delete', args })
}

export default methods
