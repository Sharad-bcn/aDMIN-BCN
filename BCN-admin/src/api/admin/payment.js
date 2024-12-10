import handler from 'api/handler'

const prefix = '/admin/payment'

const methods = {
    updatePaymentPlan: args => handler({ method: 'put', url: prefix + '/updatePaymentPlan', args })
}

export default methods