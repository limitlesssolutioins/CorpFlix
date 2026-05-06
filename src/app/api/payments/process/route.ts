import { NextResponse } from 'next/server';
import { getCompanyDataDir } from '@/lib/companyContext';
import { getPaymentService } from '@/services/payment.service';

export async function POST(request: Request) {
  try {
    const dataDir = await getCompanyDataDir();
    const paymentService = getPaymentService(dataDir);
    const { paymentId } = await request.json();
    const updatedPayment = paymentService.processPSEPayment(paymentId);
    return NextResponse.json(updatedPayment);
  } catch (error) {
    return NextResponse.json({ error: 'Error processing payment' }, { status: 500 });
  }
}
