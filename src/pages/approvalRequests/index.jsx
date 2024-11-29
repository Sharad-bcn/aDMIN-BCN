import { useEffect, useState, useRef, useCallback } from 'react'
import s from './styles.module.scss'
import { Encrypt, head, timeFormat } from 'helpers'
import { Alert, InfiniteScroll, Layouts, Loader, NoData, ImageTag, Modal, TextArea } from 'components'
import * as api from 'api'
import images from 'images'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

const tabs = ['Businesses', 'Offerings', 'Profiles']

export default function Main() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [businesses, setBusinesses] = useState([])
  const [expandedBusiness, setExpandedBusiness] = useState(0)
  const [expandedBusinessClass, setExpandedBusinessClass] = useState(1)
  const [businessRejectionMessage, setBusinessRejectionMessage] = useState('')
  const [offerings, setOfferings] = useState([])
  const [expandedOffering, setExpandedOffering] = useState(0)
  const [expandedOfferingClass, setExpandedOfferingClass] = useState(1)
  const [offeringRejectionMessage, setOfferingRejectionMessage] = useState('')
  const [users, setUsers] = useState([])
  const [expandedUser, setExpandedUser] = useState(0)
  const [expandedUserClass, setExpandedUserClass] = useState(1)
  const [userRejectionMessage, setUserRejectionMessage] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [loading, setLoading] = useState(false)
  const processing = useRef(false)
  const perPage = 10

  const getBusinesses = useCallback(
    async (filter, currPage) => {
      if (processing.current) return
      processing.current = true
      setLoading(true)
      setPageNo(currPage + 1)

      const fetchBusinesses = await api.admin.business.fetchNewlyCreated({
        perPage,
        pageNo: currPage
      })

      if (fetchBusinesses.code === 200) {
        setBusinesses(businesses.concat(fetchBusinesses.payload.Businesses))
        setTotalPages(Math.ceil(fetchBusinesses.payload.total / perPage))
      } else {
        Alert.error(fetchBusinesses.message)
      }

      setLoading(false)
      processing.current = false
    },
    [businesses]
  )

  const getOfferings = useCallback(
    async (filter, currPage) => {
      if (processing.current) return
      processing.current = true
      setLoading(true)
      setPageNo(currPage + 1)

      const fetchOfferings = await api.admin.listing.fetchNewlyCreated({
        perPage,
        pageNo: currPage
      })

      if (fetchOfferings.code === 200) {
        setOfferings(offerings.concat(fetchOfferings.payload.Listings))
        setTotalPages(Math.ceil(fetchOfferings.payload.total / perPage))
      } else {
        Alert.error(fetchOfferings.message)
      }

      setLoading(false)
      processing.current = false
    },
    [offerings]
  )

  const getUsers = useCallback(
    async (filter, currPage) => {
      if (processing.current) return
      processing.current = true
      setLoading(true)
      setPageNo(currPage + 1)

      const fetchUsers = await api.admin.user.fetchNewlyCreated({
        perPage,
        pageNo: currPage
      })

      if (fetchUsers.code === 200) {
        setUsers(users.concat(fetchUsers.payload.Users))
        setTotalPages(Math.ceil(fetchUsers.payload.total / perPage))
      } else {
        Alert.error(fetchUsers.message)
      }

      setLoading(false)
      processing.current = false
    },
    [users]
  )

  const updateOfferingApprovalStatus = async (id, isApproved) => {
    if (!isApproved && !offeringRejectionMessage) {
      Alert.warn('Rejection message is required!!')
      return
    }

    if (processing.current) return
    processing.current = true
    setLoading(true)

    const updateOffering = await api.admin.listing.updateApprovalStatus({
      id,
      isApproved,
      rejectionMessage: isApproved ? '' : offeringRejectionMessage
    })

    if (updateOffering.code === 201) {
      let currentOffering = offerings.filter(offering => offering._id === id)[0]
      setOfferings(offerings.filter(offering => offering._id !== id))
      const sendNotification = await api.publicApi.notifications.create({
        notification:
          (isApproved ? 'Congratulations!!! ' : '') +
          currentOffering.listingName +
          ' has been ' +
          (isApproved ? 'approved' : 'rejected please review!!'),
        fkUserId: currentOffering.fkUserId,
        redirect: Encrypt({
          path: '/userAdmin/businesses/' + Encrypt({ id: currentOffering.fkBusinessId }) + '/listings/'
        })
      })

      if (sendNotification.code === 201) {
      } else {
        // Alert.error(sendNotification.message)
      }
      Alert.success(updateOffering.message)
    } else {
      Alert.error(updateOffering.message)
    }

    setLoading(false)
    processing.current = false
  }

  const updateBusinessApprovalStatus = async (id, isApproved) => {
    if (!isApproved && !businessRejectionMessage) {
      Alert.warn('Rejection message is required!!')
      return
    }

    if (processing.current) return
    processing.current = true
    setLoading(true)

    const updateBusinesses = await api.admin.business.updateApprovalStatus({
      id,
      isApproved,
      rejectionMessage: isApproved ? '' : businessRejectionMessage
    })

    if (updateBusinesses.code === 201) {
      let currentBusiness = businesses.filter(business => business._id === id)[0]
      setBusinesses(businesses.filter(business => business._id !== id))
      const sendNotification = await api.publicApi.notifications.create({
        notification:
          (isApproved ? 'Congratulations!!! ' : '') +
          currentBusiness.businessName +
          ' has been ' +
          (isApproved ? 'approved' : 'rejected please review!!'),
        fkUserId: currentBusiness.fkUserId,
        redirect: Encrypt({
          path: '/userAdmin/businesses/'
        })
      })

      if (sendNotification.code === 201) {
      } else {
        // Alert.error(sendNotification.message)
      }
      Alert.success(updateBusinesses.message)
    } else {
      Alert.error(updateBusinesses.message)
    }

    setLoading(false)
    processing.current = false
  }

  const updateUserApprovalStatus = async (id, isApproved) => {
    if (!isApproved && !userRejectionMessage) {
      Alert.warn('Rejection message is required!!')
      return
    }

    if (processing.current) return
    processing.current = true
    setLoading(true)

    const updateUser = await api.admin.user.updateApprovalStatus({
      id,
      isApproved,
      rejectionMessage: isApproved ? '' : userRejectionMessage
    })

    if (updateUser.code === 201) {
      let currentUser = users.filter(user => user._id === id)[0]
      setUsers(users.filter(user => user._id !== id))
      const sendNotification = await api.publicApi.notifications.create({
        notification:
          (isApproved ? 'Congratulations!!! ' : '') +
          currentUser.firstName +
          ' ' +
          currentUser.lastName +
          ' has been ' +
          (isApproved ? 'approved' : 'rejected please review!!'),
        fkUserId: currentUser._id,
        redirect: Encrypt({
          path: '/userAdmin/editProfile'
        })
      })

      if (sendNotification.code === 201) {
      } else {
        // Alert.error(sendNotification.message)
      }
      Alert.success(updateUser.message)
    } else {
      Alert.error(updateUser.message)
    }
    setLoading(false)
    processing.current = false
  }

  useEffect(() => {
    head({ title: 'Approval Requests | BCN' })
  }, [])

  return (
    <div className={s.main}>
      <div className={s.approvalrequests}>
        <Layouts.Classic title='Approval Requests' />
        <div className={s.content + ' innerScrollX'}>
          <div className={s.tabs}>
            {!!tabs.length &&
              tabs.map((tab, i) => (
                <div
                  className={activeTab === tab ? s.tab + ' ' + s.active : s.tab}
                  onClick={() => {
                    setPageNo(1)
                    setTotalPages(0)
                    setBusinesses([])
                    setUsers([])
                    setOfferings([])
                    setActiveTab(tab)
                  }}
                  key={i}
                >
                  {tab}
                </div>
              ))}
          </div>
          {!loading &&
            ((activeTab === 'Businesses' && !businesses.length) ||
              (activeTab === 'Offerings' && !offerings.length) ||
              (activeTab === 'Profiles' && !users.length)) && <NoData />}
          <InfiniteScroll
            next={activeTab === 'Businesses' ? getBusinesses : activeTab === 'Offerings' ? getOfferings : getUsers}
            filter=''
            currentPage={pageNo}
            hasMore={pageNo <= totalPages}
            inLayout
          >
            {!!businesses.length && activeTab === 'Businesses' && (
              <div className={s.businesses}>
                {businesses.map((business, i) => (
                  <BusinessApprovalCard
                    business={business}
                    expandedBusiness={expandedBusiness}
                    setExpandedBusiness={setExpandedBusiness}
                    expandedBusinessClass={expandedBusinessClass}
                    setExpandedBusinessClass={setExpandedBusinessClass}
                    updateBusinessApprovalStatus={updateBusinessApprovalStatus}
                    businessRejectionMessage={businessRejectionMessage}
                    setBusinessRejectionMessage={setBusinessRejectionMessage}
                    index={i}
                    key={i}
                  />
                ))}
              </div>
            )}

            {!!offerings.length && activeTab === 'Offerings' && (
              <div className={s.offerings}>
                {offerings.map((offering, i) => (
                  <OfferingsApprovalCard
                    offering={offering}
                    expandedOffering={expandedOffering}
                    setExpandedOffering={setExpandedOffering}
                    expandedOfferingClass={expandedOfferingClass}
                    setExpandedOfferingClass={setExpandedOfferingClass}
                    updateOfferingApprovalStatus={updateOfferingApprovalStatus}
                    offeringRejectionMessage={offeringRejectionMessage}
                    setOfferingRejectionMessage={setOfferingRejectionMessage}
                    index={i}
                    key={i}
                  />
                ))}
              </div>
            )}
            {!!users.length && activeTab === 'Profiles' && (
              <div className={s.users}>
                {users.map((user, i) => (
                  <UsersApprovalCard
                    user={user}
                    expandedUser={expandedUser}
                    setExpandedUser={setExpandedUser}
                    expandedUserClass={expandedUserClass}
                    setExpandedUserClass={setExpandedUserClass}
                    updateUserApprovalStatus={updateUserApprovalStatus}
                    userRejectionMessage={userRejectionMessage}
                    setUserRejectionMessage={setUserRejectionMessage}
                    index={i}
                    key={i}
                  />
                ))}
              </div>
            )}
          </InfiniteScroll>
          {!!loading && <Loader color='var(--c-primary)' colorText='var(--c-primary)' />}
        </div>
      </div>
    </div>
  )
}

const BusinessApprovalCard = props => (
  <div
    className={s.businessApprovalCard}
    style={{
      height:
        props.index === props.expandedBusiness ? (props.expandedBusinessClass === 1 ? '100%' : '3.75rem') : '3.75rem'
    }}
  >
    <div className={s.businessName}>
      <div>
        <span className='material-icons-outlined'>business</span>
        {props.business.businessName}
      </div>
      <div className={s.updatedAt}>
        <span className='material-icons-outlined'>update</span>
        Last Updated On:
        <span>{timeFormat(props.business.updatedAt, true)}</span>
      </div>
    </div>
    {!!props.business.images.length && (
      <div className={s.images}>
        {props.business.images.map((image, i) => (
          <div className={s.image} key={i}>
            <ImageTag src={IMAGE_HOST + image} alt='' />
          </div>
        ))}
      </div>
    )}
    <div className={s.row}>
      <div className={s.state}>
        <span className='material-icons-outlined'>location_on</span>
        State: <span>{props.business.state}</span>
      </div>
      <div className={s.city}>
        <span className='material-icons-outlined'>location_on</span>
        City: <span>{props.business.city}</span>
      </div>
    </div>
    <div className={s.row}>
      <div className={s.category}>
        <span className='material-icons-outlined'>category</span>
        Category: <span>{props.business.category}</span>
      </div>
      {!!props.business.subCategory && (
        <div className={s.subCategory}>
          <span className='material-icons-outlined'>category</span>
          Sub-Category: <span>{props.business.subCategory}</span>
        </div>
      )}
    </div>
    <a href={'tel:+91' + props.business.phoneNo} className={s.phoneNo}>
      <span className='material-icons-outlined'>call</span>
      Contact No. : <span>+91-{props.business.phoneNo}</span>
    </a>
    {!!props.business.address && (
      <div className={s.address}>
        <span className='material-icons-outlined'>home</span>
        Address: <span>{props.business.address}</span>
      </div>
    )}
    {!!props.business.website && (
      <div className={s.website}>
        <span className='material-icons-outlined'>language</span>
        Website: <span>{props.business.website}</span>
      </div>
    )}
    {(!!props.business.facebookLink || !!props.instagramLink) && (
      <div className={s.row}>
        {props.business.facebookLink && (
          <a href={props.business.facebookLink} target='_blank' rel='noreferrer' className={s.facebook}>
            <div className={s.image}>
              <img src={images.facebookAlt} alt='' />
            </div>
            Facebook
          </a>
        )}
        {props.business.instagramLink && (
          <a href={props.business.instagramLink} target='_blank' rel='noreferrer' className={s.instagram}>
            <div className={s.image}>
              <img src={images.instagramAlt} alt='' />
            </div>
            Instagram
          </a>
        )}
      </div>
    )}
    {!!props.business.tags && props.business.tags.length !== 0 && (
      <div className={s.tags}>
        <div className={s.tagHeading}>Business Keywords</div>
        <div className={s.addedTags}>
          {props.business.tags.map((tag, i) => (
            <div className={s.tag} key={i}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    )}
    <div className={s.description}>
      <span className='material-icons-outlined'>description</span>
      {props.business.description}
    </div>
    <div className={s.rejectionReason}>
      <TextArea.Classic
        label='Rejection Message (Max. 200 words)'
        iconLeft='description'
        placeholder='Enter rejection message...'
        value={props.businessRejectionMessage}
        onChange={e => {
          if (e.target.value.trim().split(/\s+/).length <= 200) props.setBusinessRejectionMessage(e.target.value)
        }}
      />
    </div>
    <div className={s.actionButtons}>
      <div
        className={s.approve}
        onClick={() =>
          Modal.Confirm('Are u sure u want to approve ' + props.business.businessName + '?', () =>
            props.updateBusinessApprovalStatus(props.business._id, true)
          )
        }
      >
        <span className='material-icons-outlined'>done</span> Approve
      </div>
      <div
        className={s.reject}
        onClick={() =>
          Modal.Confirm('Are u sure u want to reject ' + props.business.businessName + '?', () =>
            props.updateBusinessApprovalStatus(props.business._id, false)
          )
        }
      >
        <span className='material-icons-outlined'>close</span>Reject
      </div>
    </div>
    <div
      className={
        props.index === props.expandedBusiness
          ? props.expandedBusinessClass === 1
            ? s.expand + ' ' + s.expandActive
            : s.expand
          : s.expand
      }
      onClick={e => {
        props.setExpandedBusiness(props.index)
        props.setExpandedBusinessClass(e.currentTarget.classList.length)
      }}
    >
      <span className='material-icons-outlined'>
        {props.index === props.expandedBusiness
          ? props.expandedBusinessClass === 1
            ? 'expand_less'
            : 'expand_more'
          : ' expand_more'}
      </span>
    </div>
  </div>
)

const OfferingsApprovalCard = props => (
  <div
    className={s.offeringsApprovalCard}
    style={{
      height:
        props.index === props.expandedOffering ? (props.expandedOfferingClass === 1 ? '100%' : '3.75rem') : '3.75rem'
    }}
  >
    <div className={s.offeringName}>
      <div>
        <span className='material-icons-outlined'>badge</span>
        {props.offering.listingName}
      </div>
      <div className={s.updatedAt}>
        <span className='material-icons-outlined'>update</span>
        Last Updated On:
        <span>{timeFormat(props.offering.updatedAt, true)}</span>
      </div>
    </div>
    {!!props.offering.images.length && (
      <div className={s.images}>
        {props.offering.images.map((image, i) => (
          <div className={s.image} key={i}>
            <ImageTag src={IMAGE_HOST + image} alt='' />
          </div>
        ))}
      </div>
    )}
    <div className={s.row}>
      <div className={s.category}>
        <span className='material-icons-outlined'>category</span>
        Category: <span>{props.offering.category}</span>
      </div>
      {!!props.offering.subCategory && (
        <div className={s.subCategory}>
          <span className='material-icons-outlined'>category</span>
          Sub-Category: <span>{props.offering.subCategory}</span>
        </div>
      )}
    </div>
    <div className={s.contactPerson}>
      <span className='material-icons-outlined'>person</span>
      Contact Person: <span>{props.offering.contactPerson}</span>
    </div>
    <a href={'tel:+91' + props.offering.phoneNo} className={s.phoneNo}>
      <span className='material-icons-outlined'>call</span>
      Contact No. : <span>+91-{props.offering.phoneNo}</span>
    </a>
    <div className={s.description}>
      <span className='material-icons-outlined'>description</span>
      {props.offering.description}
    </div>
    <div className={s.rejectionReason}>
      <TextArea.Classic
        label='Rejection Message (Max. 200 words)'
        iconLeft='description'
        placeholder='Enter rejection message...'
        value={props.offeringRejectionMessage}
        onChange={e => {
          if (e.target.value.trim().split(/\s+/).length <= 200) props.setOfferingRejectionMessage(e.target.value)
        }}
      />
    </div>
    <div className={s.actionButtons}>
      <div
        className={s.approve}
        onClick={() =>
          Modal.Confirm('Are u sure u want to approve ' + props.offering.listingName + '?', () =>
            props.updateOfferingApprovalStatus(props.offering._id, true)
          )
        }
      >
        <span className='material-icons-outlined'>done</span> Approve
      </div>
      <div
        className={s.reject}
        onClick={() =>
          Modal.Confirm('Are u sure u want to reject ' + props.offering.listingName + '?', () =>
            props.updateOfferingApprovalStatus(props.offering._id, false)
          )
        }
      >
        <span className='material-icons-outlined'>close</span>Reject
      </div>
    </div>
    <div
      className={
        props.index === props.expandedOffering
          ? props.expandedOfferingClass === 1
            ? s.expand + ' ' + s.expandActive
            : s.expand
          : s.expand
      }
      onClick={e => {
        props.setExpandedOffering(props.index)
        props.setExpandedOfferingClass(e.currentTarget.classList.length)
      }}
    >
      <span className='material-icons-outlined'>
        {props.index === props.expandedOffering
          ? props.expandedOfferingClass === 1
            ? 'expand_less'
            : 'expand_more'
          : ' expand_more'}
      </span>
    </div>
  </div>
)

const UsersApprovalCard = props => (
  <div
    className={s.userApprovalCard}
    style={{
      height: props.index === props.expandedUser ? (props.expandedUserClass === 1 ? '100%' : '3.75rem') : '3.75rem'
    }}
  >
    <div className={s.userName}>
      <div>
        <span className='material-icons-outlined'>person</span>

        {props.user.firstName + ' ' + props.user.lastName}
      </div>
      <div className={s.updatedAt}>
        <span className='material-icons-outlined'>update</span>
        Last Updated On:
        <span>{timeFormat(props.user.updatedAt, true)}</span>
      </div>
    </div>
    {!!props.user.logo && (
      <div className={s.images}>
        <div className={s.image}>
          <ImageTag src={IMAGE_HOST + props.user.logo} alt='' />
        </div>
      </div>
    )}
    <div className={s.gender}>
      <span className='material-icons-outlined'>male</span>
      Gender: <span>{props.user.gender}</span>
    </div>
    <div className={s.row}>
      {!!props.user.email && (
        <a href={'mailto:' + props.user.email} className={s.email}>
          <span className='material-icons-outlined'>email</span>
          Email: <span>{props.user.email}</span>
        </a>
      )}
      <a href={'tel:+91' + props.user.phoneNo} className={s.phoneNo}>
        <span className='material-icons-outlined'>call</span>
        Contact No. : <span>+91-{props.user.phoneNo}</span>
      </a>
    </div>

    <div className={s.row}>
      <div className={s.state}>
        <span className='material-icons-outlined'>location_on</span>
        State: <span>{props.user.state}</span>
      </div>
      <div className={s.city}>
        <span className='material-icons-outlined'>location_on</span>
        City: <span>{props.user.city}</span>
      </div>
    </div>
    {!!props.user.address && (
      <div className={s.address}>
        <span className='material-icons-outlined'>home</span>
        Address: <span>{props.user.address}</span>
      </div>
    )}
    <div className={s.rejectionReason}>
      <TextArea.Classic
        label='Rejection Message (Max. 200 words)'
        iconLeft='description'
        placeholder='Enter rejection message...'
        value={props.userRejectionMessage}
        onChange={e => {
          if (e.target.value.trim().split(/\s+/).length <= 200) props.setUserRejectionMessage(e.target.value)
        }}
      />
    </div>
    <div className={s.actionButtons}>
      <div
        className={s.approve}
        onClick={() =>
          Modal.Confirm('Are u sure u want to approve ' + props.user.firstName + ' ' + props.user.lastName + '?', () =>
            props.updateUserApprovalStatus(props.user._id, true)
          )
        }
      >
        <span className='material-icons-outlined'>done</span> Approve
      </div>
      <div
        className={s.reject}
        onClick={() =>
          Modal.Confirm('Are u sure u want to reject ' + props.user.firstName + ' ' + props.user.lastName + '?', () =>
            props.updateUserApprovalStatus(props.user._id, false)
          )
        }
      >
        <span className='material-icons-outlined'>close</span>Reject
      </div>
    </div>
    <div
      className={
        props.index === props.expandedUser
          ? props.expandedUserClass === 1
            ? s.expand + ' ' + s.expandActive
            : s.expand
          : s.expand
      }
      onClick={e => {
        props.setExpandedUser(props.index)
        props.setExpandedUserClass(e.currentTarget.classList.length)
      }}
    >
      <span className='material-icons-outlined'>
        {props.index === props.expandedUser
          ? props.expandedUserClass === 1
            ? 'expand_less'
            : 'expand_more'
          : ' expand_more'}
      </span>
    </div>
  </div>
)
