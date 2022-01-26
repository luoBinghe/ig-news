import { render } from '@testing-library/react'
import { getPrismicClient } from '../../services/prismic'
import { mocked } from 'jest-mock'
import Preview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { useSession } from "next-auth/client"
import { useRouter } from 'next/router'


jest.mock('../../services/prismic')
jest.mock('next-auth/client')
jest.mock('next/router')

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post content</p>',
  updatedAt: 'March, 10 2021',
}


describe('Preview page', () => {
  test('it renders Preview correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    const { getByText } = render(
      <Preview post={post} />
    )

    expect(getByText('My new post')).toBeInTheDocument()
    expect(getByText('Post content')).toBeInTheDocument()
    expect(getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  test('it redirects user to full post when user is subscribe', () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      activeSubscription: 'fake-active-subscription'
    }, false)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    })

    render(
      <Preview post={post} />
    )

    expect(pushMock).toHaveBeenCalled('/posts/my-new-post')
  })
})