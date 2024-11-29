import { useCallback, useEffect, useRef, useState } from 'react'
import s from './styles.module.scss'
import { Encrypt, getTimeFormats, head } from 'helpers'
import { Layouts, Loader } from 'components'
import { paymentPlatforms, plans } from 'data'
import * as api from 'api'

export default function Main() {
  const [loading, setLoading] = useState(false)
  const [razorPayPaymentId, setRazorPayPaymentId] = useState('')
  const processing = useRef(false)
  const userData = JSON.parse(window.localStorage.getItem('userData'))
  const activePlan = plans.find(x => x.name === userData.plan) || 'Plan 0'
  const REACT_APP_PUBLIC_URL_SITE = process.env.REACT_APP_PUBLIC_URL_SITE

  useEffect(() => {
    head({ title: 'My Subscription | BCN' })
  }, [])

  const init = useCallback(async () => {
    if (processing.current) return
    processing.current = true
    setLoading(true)

    const fetchPaymentId = await api.userAdmin.user.fetchPaymentId({})

    if (fetchPaymentId.code === 201) {
      setRazorPayPaymentId(fetchPaymentId.payload.razorPayPaymentId)
    }

    setLoading(false)
    processing.current = false
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className={s.main}>
      <div className={s.settings}>
        <Layouts.Classic title='My Subscription' />
        {!loading ? (
          <div className={s.content + ' innerScrollX'}>
            <div className={s.planInfoCard}>
              <div className={s.activePlanName}>{activePlan.name}</div>
              <div className={s.activePlanDuration}>{activePlan.duration}</div>
              <div className={s.activePlanPrice}>₹{activePlan.price}</div>
              <div className={s.activePlanExpiresAt}>
                Plan expiring on: {getTimeFormats(new Date(userData.planExpiresAt))}
              </div>
              <div className={s.actionButtons}>
                {!!razorPayPaymentId && (
                  <a
                    className={s.viewReceipt}
                    href={
                      REACT_APP_PUBLIC_URL_SITE +
                      '/paymentSuccess/' +
                      Encrypt({
                        paymentDetails: {
                          paymentId: razorPayPaymentId,
                          method: paymentPlatforms.filter(x => x.name === 'razorPay')[0].showName,
                          isLoggedIn: true
                        }
                      })
                    }
                  >
                    View Receipt
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={s.loader}>
            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />
          </div>
        )}
      </div>
    </div>
  )
}
