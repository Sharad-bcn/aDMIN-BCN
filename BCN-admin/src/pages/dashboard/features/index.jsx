import { useState, useCallback, useEffect, useRef } from 'react'
import s from './styles.module.scss'
import * as api from 'api'
import { Alert, Layouts, Loader } from 'components'
import AddCategory from './addOrEditCategory'
import { Encrypt, head } from 'helpers'
import { Link } from 'react-router-dom'
import DashBoardNav from '../dashboardNav'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

export default function Main() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const processing = useRef(false)

  const getCategories = useCallback(async () => {
    if (processing.current) return

    processing.current = true
    setLoading(true)

    const fetchCategories = await api.publicApi.categories.fetchAllCategories({})

    if (fetchCategories.code === 200) {
      setCategories(fetchCategories.payload.categories)
    } else {
      Alert.error(fetchCategories.message)
    }
    processing.current = false
    setLoading(false)
  }, [])

  useEffect(() => {
    getCategories()
  }, [getCategories])

  useEffect(() => {
    head({ title: 'Dashboard Features| BCN' })
  }, [])

  return (
    <div className={s.main}>
      <div className={s.features}>
        <Layouts.Classic title='Dashboard' />
        {!loading && (
          <div className={s.content + ' innerScrollX'}>
            <DashBoardNav />
            <div className={s.title}>Categories</div>
            <div className={s.categories}>
              {categories.map(({ _id, category, image }, i) => (
                <CategoryCard id={_id} field={category} image={IMAGE_HOST + image} key={i} />
              ))}
            </div>
            <AddCategory inLayout />
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

const CategoryCard = ({ id, field, image }) => (
  <Link to={'./category/' + Encrypt({ id })} className={s.serviceField} title={field}>
    <div>
      <img src={image} alt='' />
    </div>
    <div>{field}</div>
  </Link>
)
