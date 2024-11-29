import handler from 'api/handler'

const prefix = '/admin/user'

const methods = {
  create: args => handler({ method: 'post', url: prefix + '/create', args }),
  fetchAll: args => handler({ method: 'get', url: prefix + '/fetchAll', args }),
  blockUser: args => handler({ method: 'put', url: prefix + '/blockUser', args }),
  updateApprovalStatus: args => handler({ method: 'put', url: prefix + '/updateApprovalStatus', args }),
  fetchNewlyCreated: args => handler({ method: 'get', url: prefix + '/fetchNewlyCreated', args })
}

export default methods
