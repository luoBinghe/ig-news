import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SignInButton } from './index'
import { useSession } from 'next-auth/client'
import { mocked } from 'jest-mock'

jest.mock('next-auth/client')


describe('SignInButton component', () => {
  it('render correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SignInButton />)

    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
  })

  it('render correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([{
      user: { name: 'Jonh Doe', email: 'jonhdoe@gmail.com' }, 
      expires: 'fake-expires'
    }, false])

    render(<SignInButton />)

    expect(screen.getByText('Jonh Doe')).toBeInTheDocument()
  })
})