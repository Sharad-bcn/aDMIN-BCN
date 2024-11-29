import s from './styles.module.scss'
import CategoryCard from '../categoryCard'
import { AlphabeticalFilter, NoData } from 'components'
import { useState } from 'react'
const IMAGE_HOST = process.env.REACT_APP_IMAGE_HOST

export default function Main({
  selectedSubCategories,
  setSelectedSubCategories,
  subCategories,
  goToNextPart,
  businessId
}) {
  const [filteredSubCategories, setFilteredSubCategories] = useState(subCategories)

  const filterHandler = fields => {
    if (!fields.length) setFilteredSubCategories(subCategories)
    else {
      let filteredSubCategories = []
      for (const subCategory of subCategories) {
        if (fields.includes(subCategory.subCategory.charAt(0).toLowerCase())) filteredSubCategories.push(subCategory)
      }
      setFilteredSubCategories(filteredSubCategories)
    }
  }

  return (
    <div className={s.part2}>
      <div className={s.title}>Select Your Business Sub-Category</div>
      <div className={s.subTitle}>(You can select more than 1 category)</div>
      <div className={s.filter}>
        <AlphabeticalFilter filterHandler={filterHandler} style2 />
      </div>

      {!!filteredSubCategories.length && (
        <div className={s.services}>
          {filteredSubCategories.map(({ _id, subCategory, image }, i) => (
            <CategoryCard
              id={_id}
              field={subCategory}
              image={IMAGE_HOST + image}
              selectedField={selectedSubCategories.find(x => x._id === _id) || ''}
              setSelectedField={() => {
                const isSelected = selectedSubCategories.find(x => x._id === _id)
                if (isSelected) setSelectedSubCategories(selectedSubCategories.filter(x => x._id !== _id))
                else setSelectedSubCategories([...selectedSubCategories, { _id, subCategory }])
              }}
              key={i}
            />
          ))}
        </div>
      )}
      {!filteredSubCategories.length && <NoData />}

      {!!selectedSubCategories.length && (
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
