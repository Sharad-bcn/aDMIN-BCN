import handler from 'api/handler'

const prefix = '/admin/categories'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args }),
  update: args => handler({ method: 'put', url: prefix + '/update', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  delete: args => handler({ method: 'delete', url: prefix + '/delete', args }),
  fetchAnalytics: args => handler({ method: 'get', url: prefix + '/fetchAnalytics', args })
}

export default methods
