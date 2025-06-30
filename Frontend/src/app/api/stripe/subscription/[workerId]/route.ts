import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function GET(
  request: NextRequest,
  { params }: { params: { workerId: string } }
) {
  try {
    const { workerId } = params;

    if (!workerId) {
      return NextResponse.json(
        { error: 'Missing workerId' },
        { status: 400 }
      );
    }

    // Get all subscriptions for the worker
    const subscriptions = await stripe.subscriptions.list({
      limit: 1,
      metadata: {
        workerId,
      },
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    const subscription = subscriptions.data[0];

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      current_period_end: subscription.current_period_end,
      amount: subscription.items.data[0]?.price.unit_amount || 0,
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
} 