import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_PATH = path.join(process.cwd(), 'src/data/finanzas.json');

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
  private getData() {
    const fileContent = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(fileContent);
  }

  private saveData(data: any) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
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
      number: undefined // No guardamos el número completo por seguridad simulada
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
    const newPayment: Payment = {
      id: uuidv4(),
      amount: params.amount,
      currency: data.configuracion.moneda || 'COP',
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
      // Simular procesamiento exitoso
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

export const paymentService = new PaymentService();
