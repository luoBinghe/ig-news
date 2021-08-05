import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import { NextApiResponse } from "next-auth/internals/utils";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../services/stripe";

interface User {
    ref: {
        id: string;
    },
    data: {
        stripe_customer_id: string;
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method === 'POST'){
        const session = await getSession({ req })

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('users_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let custmerId = user.data.stripe_customer_id

        if(!custmerId){
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email
            })

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            custmerId = stripeCustomer.id
        }


        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: custmerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1JGVhaBFcpVz2omri4lZ3Gfa', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_API,
            cancel_url: process.env.STRIPE_CANCEL_API
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })

    }else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}