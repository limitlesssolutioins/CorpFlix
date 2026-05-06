import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  type: 'SUBSCRIPTION' | 'ONE_TIME';
  method: 'PSE' | 'CARD';
  reference: string;
  description?: string;
  createdAt: string;
}

export class PaymentService {
  private dataPath: string;

  constructor(dataDir: string) {
    this.dataPath = path.join(dataDir, 'finanzas.json');
  }

  private getData() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        return { configuracion: { moneda: 'COP' }, pagos: [], suscripciones: { estado: 'ACTIVO', fechaFin: null }, tarjetas: [] };
      }
      const fileContent = fs.readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch {
      return { configuracion: { moneda: 'COP' }, pagos: [], suscripciones: { estado: 'ACTIVO', fechaFin: null }, tarjetas: [] };
    }
  }

  private saveData(data: any) {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  getPayments(): Payment[] {
    return this.getData().pagos || [];
  }

  getSubscription() {
    return this.getData().suscripciones;
  }

  cancelSubscription() {
    const data = this.getData();
    data.suscripciones.estado = 'INACTIVO';
    data.suscripciones.fechaFin = null;
    this.saveData(data);
    return data.suscripciones;
  }

  getCards() {
    return this.getData().tarjetas || [];
  }

  addCard(card: any) {
    const data = this.getData();
    if (!data.tarjetas) data.tarjetas = [];
    const newCard = {
      ...card,
      id: uuidv4(),
      last4: card.number.slice(-4),
      number: undefined
    };
    data.tarjetas.push(newCard);
    this.saveData(data);
    return newCard;
  }

  deleteCard(id: string) {
    const data = this.getData();
    data.tarjetas = data.tarjetas.filter((c: any) => c.id !== id);
    this.saveData(data);
    return true;
  }

  createPayment(params: {
    amount: number;
    type: 'SUBSCRIPTION' | 'ONE_TIME';
    method: 'PSE' | 'CARD';
    description?: string;
  }): Payment {
    const data = this.getData();
    if (!data.pagos) data.pagos = [];
    const newPayment: Payment = {
      id: uuidv4(),
      amount: params.amount,
      currency: data.configuracion?.moneda || 'COP',
      status: 'PENDING',
      type: params.type,
      method: params.method,
      reference: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      description: params.description,
      createdAt: new Date().toISOString()
    };

    data.pagos.push(newPayment);
    this.saveData(data);
    return newPayment;
  }

  processPSEPayment(paymentId: string) {
    const data = this.getData();
    const payment = data.pagos.find((p: Payment) => p.id === paymentId);

    if (payment) {
      payment.status = 'COMPLETED';

      if (payment.type === 'SUBSCRIPTION') {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        data.suscripciones = {
          plan: payment.description || 'Mensual',
          estado: 'ACTIVO',
          fechaFin: endDate.toISOString()
        };
      }

      this.saveData(data);
    }
    return payment;
  }
}

const instances = new Map<string, PaymentService>();

export function getPaymentService(dataDir: string): PaymentService {
  if (!instances.has(dataDir)) {
    instances.set(dataDir, new PaymentService(dataDir));
  }
  return instances.get(dataDir)!;
}
