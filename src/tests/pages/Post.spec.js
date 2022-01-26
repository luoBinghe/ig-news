import { render } from '@testing-library/react'
import { getPrismicClient } from '../../services/prismic'
import { mocked } from 'jest-mock'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getSession } from "next-auth/client"


jest.mock('../../services/prismic')
jest.mock('next-auth/client')

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>Post content</p>',
  updatedAt: 'March, 10 2021',
}


describe('Post page', () => {
  test('it renders Post correctly', () => {
    const { getByText } = render(
      <Post post={post} />
    )

    expect(getByText('My new post')).toBeInTheDocument()
    expect(getByText('Post content')).toBeInTheDocument()
  })

  test('it redirects user if no subscribe', async () => {
    const noSubscriptionMocked = mocked(getSession)

    noSubscriptionMocked.mockReturnValueOnce({
      activeSubscription: null
    })

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } })

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining ({
          destination: '/',
      })
      })
    )
  })

  test('it loads inital data', async () => {
    const noSubscriptionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' }
          ],
          content: [
            { type: 'paragraph',  text: 'Post content' }
          ]
        },
        last_publication_date: '04-01-2021'
      })
    })

    noSubscriptionMocked.mockReturnValueOnce({
      activeSubscription: 'fake-active-subscription'
    })

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } })

    expect(response).toEqual(
      expect.objectContaining({
        props: {post: {content: "<p>Post content</p>", slug: "my-new-post", title: "My new post", updatedAt: "01 de abril de 2021"}}})
    )
  })
})