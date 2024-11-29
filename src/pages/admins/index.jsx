import { useEffect, useState, useRef, useCallback } from 'react'
import s from './styles.module.scss'
import { head } from 'helpers'
import { Alert, InfiniteScroll, Layouts, Loader, NoData, Search, Table } from 'components'
import * as api from 'api'
import { Link } from 'react-router-dom'

export default function Main() {
  const [admins, setAdmins] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [searchedAdmins, setSearchedAdmins] = useState([])
  const [searchedPageNo, setSearchedPageNo] = useState(1)
  const [totalsearchedPages, setTotalSearchedPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const processing = useRef(false)
  const perPage = 10

  useEffect(() => {
    head({ title: 'Admins | BCN' })
  }, [])

  const getAdmins = useCallback(
    async (filter, currPage) => {
      if (processing.current) return
      processing.current = true

      setLoading(true)
      setPageNo(currPage + 1)

      const fetchAllAdmins = await api.admin.adminControls.fetchAll({
        searchQuery,
        limit: perPage,
        pageNo: currPage
      })

      if (fetchAllAdmins.code === 200) {
        setAdmins(admins.concat(fetchAllAdmins.payload.Admins))
        setTotalPages(Math.ceil(fetchAllAdmins.payload.total / perPage))
      } else {
        Alert.error(fetchAllAdmins.message)
      }
      processing.current = false
      setLoading(false)
    },
    [admins, searchQuery]
  )

  const searchHandler = useCallback(
    async (filter, currPage) => {
      if (processing.current) return
      processing.current = true

      setLoading(true)
      setSearchedPageNo(currPage + 1)

      const fetchAllSearchedAdmins = await api.admin.adminControls.fetchAll({
        searchQuery,
        limit: perPage,
        pageNo: currPage
      })

      if (fetchAllSearchedAdmins.code === 200) {
        setSearchedAdmins(searchedAdmins.concat(fetchAllSearchedAdmins.payload.Admins))
        setTotalSearchedPages(Math.ceil(fetchAllSearchedAdmins.payload.total / perPage))
      } else {
        Alert.error(fetchAllSearchedAdmins.message)
      }
      processing.current = false
      setLoading(false)
    },
    [searchedAdmins, searchQuery]
  )

  return (
    <div className={s.main}>
      <div className={s.admins}>
        <Layouts.Classic title='Admins'>
          <div className={s.headerBottom}>
            <Search
              placeholder='Search Admins'
              searchHandler={search => {
                setSearchQuery(search)
                setSearchedAdmins([])
                setSearchedPageNo(1)
              }}
              isAdmin
            />
            <div className={s.headerInner}>
              <Link className={s.addAdmin} to={'./addAdmin'}>
                <span className='material-icons-outlined'>add_circle_outline</span> Add
              </Link>
            </div>
          </div>
        </Layouts.Classic>
        <div className={s.content + ' innerScrollX'} style={{ justifyContent: !admins.length && 'center' }}>
          {!!searchQuery && <div className={s.searchResults}>"Search Results for {searchQuery}"</div>}
          {!loading && !admins.length && !searchQuery && <NoData />}
          {!loading && !searchedAdmins.length && searchQuery && <NoData />}

          <InfiniteScroll
            next={!searchQuery ? getAdmins : searchHandler}
            filter=''
            currentPage={!searchQuery ? pageNo : searchedPageNo}
            hasMore={!searchQuery ? pageNo <= totalPages : searchedPageNo <= totalsearchedPages}
            inLayout
          >
            {!searchQuery && !!admins.length && (
              <div className={s.userData}>
                <Table.Admins adminData={admins} setAdmins={setAdmins} />
              </div>
            )}
            {!!searchQuery && !!searchedAdmins.length && (
              <div className={s.userData}>
                <Table.Admins adminData={searchedAdmins} setSearchedAdmins={setSearchedAdmins} />
              </div>
            )}
          </InfiniteScroll>
          {!!loading && <Loader color='var(--c-primary)' colorText='var(--c-primary)' />}
        </div>
      </div>
    </div>
  )
}
