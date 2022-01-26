import { render } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import { mocked } from 'jest-mock'
import Home from '../../pages/index'
import { getStaticProps } from '../../pages/index'

jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})
jest.mock('../../services/stripe')
jest.mock('next/router')

describe('Home page', () => {
  test('it renders Home correctly', () => {
    const { getByText } = render(
      <Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }} />
    )

    expect(getByText('for R$10,00 month')).toBeInTheDocument()
  })

  test('it loads inital data', async () => {
    const retrivePricesStripeMocked = mocked(stripe.prices.retrieve)

    retrivePricesStripeMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    })

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})