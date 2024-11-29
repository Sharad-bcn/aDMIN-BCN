import { Alert, Input, Layouts, Loader } from 'components'
import s from './styles.module.scss'
import { useState, useRef, useEffect, useCallback } from 'react'
import { head } from 'helpers'
import DashBoardNav from '../../dashboardNav'
import * as api from 'api'
import { useNavigate } from 'react-router-dom'

export default function Main() {
  const [loadingStatus, setLoadingStatus] = useState('Loading...')
  const [loading, setLoading] = useState(false)
  const [faqs, setFaqs] = useState([
    {
      question: '',
      answer: ''
    },
    {
      question: '',
      answer: ''
    }
  ])
  const navigate = useNavigate()
  const processing = useRef(false)

  const faqRemoveHandler = async index => {
    let newFaqs = faqs.filter((x, i) => i !== index)
    setFaqs(newFaqs)
  }

  const faqAnswerChangeHandler = async (value, index) => {
    let newFaqs = [...faqs]
    newFaqs[index] = {
      ...newFaqs[index],
      answer: value
    }
    setFaqs(newFaqs)
  }

  const faqQuestionChangeHandler = async (value, index) => {
    let newFaqs = [...faqs]
    newFaqs[index] = {
      ...newFaqs[index],
      question: value
    }
    setFaqs(newFaqs)
  }

  const getFaqs = useCallback(async () => {
    if (processing.current) return
    processing.current = true
    setLoading(true)

    const fetchFaqs = await api.admin.faq.fetch({})

    if (fetchFaqs.code === 201) {
      setFaqs(fetchFaqs.payload.faqs)
    } else {
      Alert.error(fetchFaqs.message)
    }

    setLoading(false)
    processing.current = false
  }, [])

  useEffect(() => {
    getFaqs()
  }, [getFaqs])

  const saveHandler = async () => {
    if (faqs.length) {
      let isFaqEmpty = false

      for (const obj of faqs) {
        if (!obj.question || obj.question.trim() === '' || !obj.answer || obj.answer.trim() === '') isFaqEmpty = true
      }

      if (isFaqEmpty) {
        Alert.warn('Faq is Empty!')
        return
      }
    }

    if (processing.current) return
    processing.current = true
    Alert.success('Saving Faqs info...')
    setLoading(true)
    setLoadingStatus('Saving...')

    const saveFaqs = await api.admin.faq.update({
      faqs
    })

    if (saveFaqs.code === 201) {
      Alert.success(saveFaqs.message)
      navigate(-1)
    } else {
      Alert.error(saveFaqs.message)
    }

    setLoading(false)
    processing.current = false
  }

  useEffect(() => {
    head({ title: "Faq's | BCN" })
  }, [])

  return (
    <div className={s.main}>
      <div className={s.faqOuter}>
        <Layouts.Classic title={"Faq's"}>
          <div className={s.headerBottom}>
            <div className={s.addFaq} onClick={saveHandler}>
              <span className='material-icons-outlined'>save</span> Save
            </div>
          </div>
        </Layouts.Classic>
        {!loading && (
          <div className={s.content + ' innerScrollX'}>
            <DashBoardNav />
            <div className={s.faqs}>
              <div className={s.title}>Faq's</div>
              {!!faqs.length &&
                faqs.map((faq, i) => (
                  <Faq
                    key={i}
                    index={i}
                    faqs={faqs}
                    faqQuestionChangeHandler={faqQuestionChangeHandler}
                    faqAnswerChangeHandler={faqAnswerChangeHandler}
                    faqRemoveHandler={faqRemoveHandler}
                  />
                ))}
            </div>
            <div className={s.addMore}>
              <div
                onClick={() => {
                  let newFaq = {
                    question: '',
                    answer: ''
                  }
                  let newFaqs = [...faqs]
                  newFaqs.push(newFaq)
                  setFaqs(newFaqs)
                }}
              >
                Add More Faqs <span className='material-icons-outlined'>add_circle_outline</span>
              </div>
            </div>
          </div>
        )}
        {!!loading && (
          <div className={s.loader}>
            <Loader message={loadingStatus} color='var(--c-primary)' colorText='var(--c-primary)' />
          </div>
        )}
      </div>
    </div>
  )
}

const Faq = props => (
  <div className={s.faq}>
    <div className={s.title}>
      <span>Question {props.index + 1}</span>
      <span onClick={() => props.faqRemoveHandler(props.index)}>
        Remove<span className='material-icons-outlined'>cancel</span>
      </span>
    </div>
    <Input.Classic
      type='text'
      iconLeft='question_answer'
      placeholder='Enter Question'
      value={props.faqs[props.index].question}
      onChange={e => props.faqQuestionChangeHandler(e.target.value, props.index)}
    />
    <div className={s.title}>
      <span>Answer {props.index + 1}</span>
    </div>
    <Input.Classic
      type='text'
      iconLeft='question_answer'
      placeholder='Enter Answer'
      value={props.faqs[props.index].answer}
      onChange={e => props.faqAnswerChangeHandler(e.target.value, props.index)}
    />
  </div>
)
