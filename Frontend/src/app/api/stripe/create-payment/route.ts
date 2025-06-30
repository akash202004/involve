import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const { amount, serviceName, customerEmail, customerId } = await request.json();

    console.log('Creating payment session with:', {
      amount,
      serviceName,
      customerEmail,
      customerId,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    });

    if (!amount || !serviceName || !customerEmail) {
      console.error('Missing required fields:', { amount, serviceName, customerEmail });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: serviceName,
              description: `Payment for ${serviceName} service`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/booking/services?service=${encodeURIComponent(serviceName)}&canceled=true`,
      customer_email: customerEmail,
      metadata: {
        customerId: customerId || 'unknown',
        serviceName,
        amount: amount.toString(),
      },
    });

    console.log('Payment session created successfully:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating payment session:', error);
    
    // Return more specific error information
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Payment failed: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
} 