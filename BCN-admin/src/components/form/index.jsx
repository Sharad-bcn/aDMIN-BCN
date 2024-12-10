import { createRef } from 'react'

export default function Main({ children, style, className }) {
  const ref = createRef()

  return (
    <form
      className={className}
      style={style}
      onSubmit={e => e.preventDefault()}
      onKeyDown={e => {
        // On enter
        if (e.key === 'Enter') {
          // If not textarea
          if (e.target.tagName !== 'TEXTAREA') {
            // Prevent calling first button "onClick" method
            e.preventDefault()
            // Call "onClick" of button having attribute "submit"
            ref.current.querySelector('button[type="submit"]')?.click()
          }
        }
      }}
      spellCheck='false'
      autoComplete='off'
      autoCorrect='off'
      autoCapitalize='off'
      ref={_ref => (ref.current = _ref)}
    >
      {children}
    </form>
  )
}
