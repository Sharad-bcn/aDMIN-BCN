import handler from 'api/handler'

const prefix = '/admin/testimony'

const methods = {
  update: args => handler({ method: 'put', url: prefix + '/update', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args })
}

export default methods
