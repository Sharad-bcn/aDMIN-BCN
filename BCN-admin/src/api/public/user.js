import handler from 'api/handler'

const prefix = '/public/user'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args }),
  fetch: args => handler({ method: 'get', url: prefix + '/fetch', args }),
  part2Validation: args => handler({ method: 'get', url: prefix + '/part2Validation', args })
}

export default methods
