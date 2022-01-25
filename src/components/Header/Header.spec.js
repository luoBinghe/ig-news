import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from './index'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

jest.mock('next-auth/client', () => {
  return {
    useSession(){
      return [null, false]
    }
  }
})

describe('Home component', () => {
  test('', () => {
    const { getByText } = render(<Header />)

    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Posts')).toBeInTheDocument()
  })
})