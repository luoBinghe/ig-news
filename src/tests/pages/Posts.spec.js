import { render } from '@testing-library/react'
import { getPrismicClient } from '../../services/prismic'
import { mocked } from 'jest-mock'
import Posts from '../../pages/posts/index'
import { getStaticProps } from '../../pages/posts/index'


jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'my-new-post',
    title: 'My new post',
    excerpt: 'Post excerp',
    updatedAt: 'March, 10 2021',
  }
]

describe('Posts page', () => {
  test('it renders Posts correctly', () => {
    const { getByText } = render(
      <Posts posts={posts} />
    )

    expect(getByText('My new post')).toBeInTheDocument()
  })

  test('it loads inital data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My new post' }
              ],
              content: [
                { type: 'paragraph',  text: 'Post excerp' }
              ]
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    })

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My new post',
            excerpt: 'Post excerp',
            updatedAt: '01 de abril de 2021',
          }]
        }
      })
    )
  })
})