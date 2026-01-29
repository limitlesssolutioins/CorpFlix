import { NextResponse } from 'next/server';
import { paymentService } from '@/services/payment.service';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();
    const updatedPayment = paymentService.processPSEPayment(paymentId);
    return NextResponse.json(updatedPayment);
  } catch (error) {
    return NextResponse.json({ error: 'Error processing payment' }, { status: 500 });
  }
}
