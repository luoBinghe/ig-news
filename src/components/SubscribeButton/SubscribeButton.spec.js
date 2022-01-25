import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SubscribeButton } from './index'
import { useSession, signIn } from 'next-auth/client'
import { mocked } from 'jest-mock'
import { useRouter } from 'next/router'

jest.mock('next-auth/client')

jest.mock('next/router')


describe('SubscribeButton component', () => {
  it('render correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user when not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    const signInMocked = mocked(signIn)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already have subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)

    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([{
      user: { name: 'Jonh Doe', email: 'jonhdoe@gmail.com' }, 
      activeSubscription: 'fake-active-subscription',
      expires: 'fake-expires'
    }, false])

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    })

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalled()
  })
})