import { useState, useCallback, useEffect, useRef } from 'react'
import s from './styles.module.scss'
import { Decrypt, head } from 'helpers'
import { AdvancedSelect, Alert, ImageTag, Layouts, Loader, Modal } from 'components'
import DashBoardNav from '../../dashboardNav'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as api from 'api'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

export default function Main() {
  const [category, setCategory] = useState('')
  const [subCategories, setSubCategories] = useState([])
  const [categoryAnalytics, setCategoryAnalytics] = useState('')
  const [subCategoriesAnalytics, setSubCategoriesAnalytics] = useState([])
  const [state, setState] = useState('')
  const [states, setStates] = useState([])
  const [reRender, setReRender] = useState(false)
  const [city, setCity] = useState('')
  const [cities, setCities] = useState([])
  const processing = useRef(false)
  const processing1 = useRef(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  let { categoryId } = useParams()
  if (categoryId) categoryId = Decrypt(categoryId).id

  useEffect(() => {
    head({ title: 'Dashboard Features| BCN' })
  }, [])

  const getCategoryWithItsSubCategories = useCallback(async () => {
    if (processing.current) return
    processing.current = true
    setLoading(true)

    const fetchCategoryWithItsSubCategories = await api.admin.categories.fetch({ categoryId })

    if (fetchCategoryWithItsSubCategories.code === 200) {
      setCategory(fetchCategoryWithItsSubCategories.payload.category)
      setSubCategories(fetchCategoryWithItsSubCategories.payload.subCategories)
    } else {
      Alert.error(fetchCategoryWithItsSubCategories.message)
    }

    setLoading(false)
    processing.current = false
  }, [categoryId])

  useEffect(() => {
    if (categoryId) getCategoryWithItsSubCategories()
  }, [categoryId, getCategoryWithItsSubCategories])

  const getCategoryWithItsSubCategoriesAnalytics = useCallback(async () => {
    if (processing1.current) return
    processing1.current = true
    setLoading(true)

    const fetchCategoryWithItsSubCategories = await api.admin.categories.fetchAnalytics({
      categoryId,
      state,
      city
    })

    if (fetchCategoryWithItsSubCategories.code === 200) {
      setCategoryAnalytics(fetchCategoryWithItsSubCategories.payload.category)
      setSubCategoriesAnalytics(fetchCategoryWithItsSubCategories.payload.subCategories)
    } else {
      Alert.error(fetchCategoryWithItsSubCategories.message)
    }

    setLoading(false)
    processing1.current = false
  }, [categoryId, state, city])

  useEffect(() => {
    if (categoryId) getCategoryWithItsSubCategoriesAnalytics()
  }, [categoryId, getCategoryWithItsSubCategoriesAnalytics])

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

  useEffect(() => {
    if (state) getCities('')
  }, [state, getCities])

  // const deleteHandler = async () => {
  //   if (processing.current) return
  //   processing.current = true

  //   const deleteCategory = await api.admin.categories.delete({ categoryId: categoryId.id })

  //   if (deleteCategory.code === 200) {
  //     Alert.warn(deleteCategory.message)
  //     navigate('/admin/dashboard/features')
  //   } else {
  //     Alert.error(deleteCategory.message)
  //   }
  //   processing.current = false
  // }

  return (
    <div className={s.main}>
      <div className={s.categoryAnalytics}>
        <Layouts.Classic title='Dashboard'>
          <div className={s.headerBottom}>
            <AdvancedSelect
              defaultField={state ? state : 'Search state'}
              iconLeft='location_on'
              fieldName='state'
              list={states}
              changeHandler={getStates}
              listFieldHandler={field => {
                setCity('')
                setCities([])
                setReRender(true)
                setState(field.state)
              }}
            />
            {!!state && !reRender && (
              <AdvancedSelect
                defaultField={city ? city : 'Select City'}
                iconLeft='location_on'
                fieldName='city'
                list={cities}
                changeHandler={getCities}
                listFieldHandler={field => {
                  setCity(field.city)
                }}
              />
            )}
          </div>
        </Layouts.Classic>
        {!loading && (
          <div className={s.content + ' innerScrollX'}>
            <DashBoardNav />
            <div className={s.title}>Category</div>

            <div className={s.category}>
              <div className={s.categoryName}>
                <div className={s.image}>
                  <ImageTag src={IMAGE_HOST + category.image} alt='' />
                </div>
                {category.category}
              </div>
              <Analytics
                views={categoryAnalytics.views ? categoryAnalytics.views : 0}
                leads={categoryAnalytics.leads ? categoryAnalytics.leads : 0}
                businesses={categoryAnalytics.businesses ? categoryAnalytics.businesses : 0}
                listings={categoryAnalytics.listings ? categoryAnalytics.listings : 0}
              />
            </div>

            <div className={s.subCategories}>
              <div className={s.title}>Sub-Categories</div>
              {!!subCategories.length &&
                subCategories.map((subCategory, i) => {
                  let subCategoryAnalytics = subCategoriesAnalytics.filter(
                    x => x.subCategory === subCategory.subCategory
                  )[0]
                  return (
                    <div className={s.subCategory} key={i}>
                      <div className={s.subCategoryName}>
                        <div className={s.image}>
                          <ImageTag src={IMAGE_HOST + subCategory.image} alt='' />
                        </div>
                        {subCategory.subCategory}:
                      </div>
                      <Analytics
                        views={subCategoryAnalytics ? subCategoryAnalytics.views : 0}
                        leads={subCategoryAnalytics ? subCategoryAnalytics.leads : 0}
                        businesses={subCategoryAnalytics ? subCategoryAnalytics.businesses : 0}
                        listings={subCategoryAnalytics ? subCategoryAnalytics.listings : 0}
                      />
                    </div>
                  )
                })}
            </div>
            <div className={s.actionButtons}>
              {/* <div
                className={s.delete}
                onClick={() =>
                  Modal.Confirm(
                    'Are u sure u want to delete ' +
                      categoryId.categoryName +
                      " category, this action will also remove it's subCategories?",
                    deleteHandler
                  )
                }
              >
                <span className='material-icons-outlined'>delete</span>Delete
              </div> */}
              <Link to='./editCategory'>
                <span className='material-icons-outlined'>edit</span>Edit
              </Link>
            </div>
          </div>
        )}

        {!!loading && (
          <div className={s.loader}>
            <Loader color='var(--c-primary)' colorText='var(--c-primary)' />
          </div>
        )}
      </div>
    </div>
  )
}

const Analytics = props => (
  <div className={s.analytics}>
    <div className={s.analyticsField}>
      <span className='material-icons-outlined'>visibility</span>Views: {props.views}
    </div>
    <div className={s.analyticsField}>
      <span className='material-icons-outlined'>leaderboard</span>Leads: {props.leads}
    </div>
    <div className={s.analyticsField}>
      <span className='material-icons-outlined'>business</span>Businesses: {props.businesses}
    </div>
    <div className={s.analyticsField}>
      <span className='material-icons-outlined'>business</span>Offerings: {props.listings}
    </div>
  </div>
)
