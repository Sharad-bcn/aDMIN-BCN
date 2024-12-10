import handler from 'api/handler'

const prefix = '/admin/business'

const methods = {
  updateApprovalStatus: args => handler({ method: 'put', url: prefix + '/updateApprovalStatus', args }),
  fetchNewlyCreated: args => handler({ method: 'get', url: prefix + '/fetchNewlyCreated', args })
}

export default methods
