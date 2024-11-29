import s from './styles.module.scss'
import CategoryCard from '../categoryCard'
import { useState } from 'react'
import { AlphabeticalFilter, NoData } from 'components'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

export default function Main({ selectedCategory, setSelectedCategory, categories, goToNextPart, businessId }) {
  const [filteredCategories, setFilteredCategories] = useState(categories)

  const filterHandler = fields => {
    if (!fields.length) setFilteredCategories(categories)
    else {
      let filteredCategories = []
      for (const category of categories) {
        if (fields.includes(category.category.charAt(0).toLowerCase())) filteredCategories.push(category)
      }
      setFilteredCategories(filteredCategories)
    }
  }

  return (
    <div className={s.part1}>
      <div className={s.title}>Select Your Business Category</div>
      <div className={s.filter}>
        <AlphabeticalFilter filterHandler={filterHandler} style2 />
      </div>
      {!!filteredCategories.length && (
        <div className={s.services}>
          {filteredCategories.map(({ _id, category, image }, i) => (
            <CategoryCard
              id={_id}
              field={category}
              image={IMAGE_HOST + image}
              selectedField={selectedCategory}
              setSelectedField={() => {
                setSelectedCategory({ _id, category })
                goToNextPart()
              }}
              key={i}
            />
          ))}
        </div>
      )}

      {!filteredCategories.length && <NoData />}

      {!!businessId && !!selectedCategory && (
        <div className={s.addBusiness} onClick={goToNextPart}>
          Next
          <span className='material-icons-outlined' style={{ paddingLeft: '0.25rem' }}>
            arrow_forward
          </span>
        </div>
      )}
    </div>
  )
}
