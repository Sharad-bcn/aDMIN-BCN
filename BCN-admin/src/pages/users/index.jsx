import { useRef, useState, useEffect, useCallback } from 'react'
import s from './styles.module.scss'
import { head } from 'helpers'
import { AdvancedSelect, Alert, InfiniteScroll, Layouts, Loader, NoData, Search, Table } from 'components'
import * as api from 'api'
import { Link } from 'react-router-dom'

export default function Main() {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [searchedUsers, setSearchedUsers] = useState([])
  const [searchedPageNo, setSearchedPageNo] = useState(1)
  const [state, setState] = useState('')
  const [states, setStates] = useState([])
  const [reRender, setReRender] = useState(false)
  const [city, setCity] = useState('')
  const [cities, setCities] = useState([])
  const [totalsearchedPages, setTotalSearchedPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const processing = useRef(false)
  const perPage = 10

  useEffect(() => {
    head({ title: 'Users | BCN' })
  }, [])

  const getStates = useCallback(async stateSearch => {
    if (processing.current) return
    processing.current = true

    const fetchStateSuggestions = await api.publicApi.locations.fetchAllStates({ limit: 10, state: stateSearch })

    if (fetchStateSuggestions.code === 200) {
      setStates(fetchStateSuggestions.payload.states)
    } else {
      // Alert.error(fetchStateSuggestions.message)
    }
    processing.current = false
  }, [])

  useEffect(() => {
    getStates('')
  }, [getStates])

  const getCities = useCallback(
    async citySearch => {
      if (processing.current) return
      processing.current = true
      let fkStateId = ''

      const stateSelected = await api.publicApi.locations.fetchAllStates({ limit: 10, state })

      if (stateSelected.code === 200) {
        fkStateId = stateSelected.payload.states[0]._id
      } else return

      const fetchCitySuggestions = await api.publicApi.locations.fetchAllCitiesViaState({
        limit: 10,
        city: citySearch,
        fkStateId
      })

      if (fetchCitySuggestions.code === 200) {
        setCities(fetchCitySuggestions.payload.cities)
      } else {
        // Alert.error(fetchCitySuggestions.message)
      }

      setReRender(false)
      processing.current = false
    },
    [state]
  )

  const getUsers = useCallback(
    async (filter, currPage) => {
      if (processing.current) return
      processing.current = true

      setLoading(true)
      setPageNo(currPage + 1)

      const fetchAllUsers = await api.admin.user.fetchAll({
        searchQuery,
        limit: perPage,
        pageNo: currPage,
        state,
        city
      })

      if (fetchAllUsers.code === 200) {
        setUsers(users.concat(fetchAllUsers.payload.Users))
        setTotalPages(Math.ceil(fetchAllUsers.payload.total / perPage))
      } else {
        Alert.error(fetchAllUsers.message)
      }
      processing.current = false
      setLoading(false)
    },
    [users, city, state, searchQuery]
  )

  const searchHandler = useCallback(
    async (filter, currPage) => {
      if (processing.current) return
      processing.current = true

      setLoading(true)
      setSearchedPageNo(currPage + 1)

      const fetchAllSearchedUsers = await api.admin.user.fetchAll({
        searchQuery,
        limit: perPage,
        pageNo: currPage,
        state,
        city
      })

      if (fetchAllSearchedUsers.code === 200) {
        setSearchedUsers(searchedUsers.concat(fetchAllSearchedUsers.payload.Users))
        setTotalSearchedPages(Math.ceil(fetchAllSearchedUsers.payload.total / perPage))
      } else {
        Alert.error(fetchAllSearchedUsers.message)
      }
      processing.current = false
      setLoading(false)
    },
    [searchedUsers, city, state, searchQuery]
  )

  useEffect(() => {
    if (state) getCities('')
  }, [state, getCities])

  return (
    <div className={s.main}>
      <div className={s.users}>
        <Layouts.Classic title='Users'>
          <div className={s.headerBottom}>
            <Search
              placeholder='Search Users'
              searchHandler={search => {
                setSearchQuery(search)
                setSearchedUsers([])
                setSearchedPageNo(1)
              }}
              isAdmin
            />
            <div className={s.headerInner}>
              <AdvancedSelect
                defaultField={state ? state : 'Search state'}
                iconLeft='location_on'
                // label='State *'
                fieldName='state'
                list={states}
                changeHandler={getStates}
                listFieldHandler={field => {
                  setCity('')
                  setCities([])
                  setReRender(true)
                  setState(field.state)
                  setUsers([])
                  setPageNo(1)
                  setSearchedUsers([])
                  setSearchedPageNo(1)
                }}
              />
              {!!state && !reRender && (
                <AdvancedSelect
                  defaultField={city ? city : 'Select City'}
                  iconLeft='location_on'
                  fieldName='city'
                  // label='City *'
                  list={cities}
                  changeHandler={getCities}
                  listFieldHandler={field => {
                    setUsers([])
                    setPageNo(1)
                    setSearchedUsers([])
                    setSearchedPageNo(1)
                    setCity(field.city)
                  }}
                />
              )}
              <Link className={s.addUser} to={'./addUser'}>
                <span className='material-icons-outlined'>add_circle_outline</span> Add User
              </Link>
            </div>
          </div>
        </Layouts.Classic>
        <div className={s.content + ' innerScrollX'} style={{ justifyContent: !users.length && 'center' }}>
          {!!searchQuery && <div className={s.searchResults}>"Search Results for {searchQuery}"</div>}
          {!loading && !users.length && !searchQuery && <NoData />}
          {!loading && !searchedUsers.length && searchQuery && <NoData />}

          <InfiniteScroll
            next={!searchQuery ? getUsers : searchHandler}
            filter=''
            currentPage={!searchQuery ? pageNo : searchedPageNo}
            hasMore={!searchQuery ? pageNo <= totalPages : searchedPageNo <= totalsearchedPages}
            inLayout
          >
            {!searchQuery && !!users.length && (
              <div className={s.userData}>
                <Table.Users userData={users} />
              </div>
            )}
            {!!searchQuery && !!searchedUsers.length && (
              <div className={s.userData}>
                <Table.Users userData={searchedUsers} />
              </div>
            )}
          </InfiniteScroll>

          {!!loading && <Loader color='var(--c-primary)' colorText='var(--c-primary)' />}
        </div>
      </div>
    </div>
  )
}
