import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getPaymentService } from '@/services/payment.service';

export async function GET() {
  try {
    const dataDir = await getCompanyDataDir();
    const paymentService = getPaymentService(dataDir);
    const payments = paymentService.getPayments();
    const subscription = paymentService.getSubscription();
    const cards = paymentService.getCards();
    return NextResponse.json({ payments, subscription, cards });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching payment data' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const dataDir = await getCompanyDataDir();
    const paymentService = getPaymentService(dataDir);
    const { action } = await request.json();
    if (action === 'CANCEL') {
      const sub = paymentService.cancelSubscription();
      return NextResponse.json(sub);
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating subscription' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const dataDir = await getCompanyDataDir();
    const paymentService = getPaymentService(dataDir);
    const card = await request.json();
    const newCard = paymentService.addCard(card);
    return NextResponse.json(newCard);
  } catch (error) {
    return NextResponse.json({ error: 'Error adding card' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const dataDir = await getCompanyDataDir();
    const paymentService = getPaymentService(dataDir);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      paymentService.deleteCard(id);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting card' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dataDir = await getCompanyDataDir();
    const paymentService = getPaymentService(dataDir);
    const body = await request.json();
    const newPayment = paymentService.createPayment(body);
    return NextResponse.json(newPayment);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating payment' }, { status: 500 });
  }
}
