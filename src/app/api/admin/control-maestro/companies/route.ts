import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const ADMIN_TOKEN = 'lidus_admin_super_secret_token_2026';

// Helper to get company subscription
function getCompanySubscription(companyId: string) {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'companies', companyId, 'finanzas.json');
    try {
        if (!fs.existsSync(dataPath)) {
            return { plan: 'Mensual Total', estado: 'ACTIVO', fechaFin: null };
        }
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return parsed.suscripciones || { plan: 'Mensual Total', estado: 'ACTIVO', fechaFin: null };
    } catch {
        return { plan: 'Mensual Total', estado: 'ACTIVO', fechaFin: null };
    }
}

// Helper to save company subscription
function saveCompanySubscription(companyId: string, subscription: any) {
    const dirPath = path.join(process.cwd(), 'src', 'data', 'companies', companyId);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const dataPath = path.join(dirPath, 'finanzas.json');
    let data: any = { configuracion: { moneda: 'COP' }, pagos: [], suscripciones: {}, tarjetas: [] };
    
    try {
        if (fs.existsSync(dataPath)) {
            const fileContent = fs.readFileSync(dataPath, 'utf-8');
            data = JSON.parse(fileContent);
        }
    } catch (e) {
        console.error('Error reading finanzas.json for company', companyId, e);
    }

    data.suscripciones = {
        plan: subscription.plan || 'Mensual Total',
        estado: subscription.estado || 'ACTIVO',
        fechaFin: subscription.fechaFin || null
    };

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET: List all companies, their users, and subscription info
export async function GET(request: Request) {
    try {
        const token = request.headers.get('x-admin-token');
        if (token !== ADMIN_TOKEN) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Get all companies
        const companies = await query<any[]>('SELECT id, name, nit, status, createdAt FROM Company ORDER BY createdAt DESC');
        
        // Get all users
        const users = await query<any[]>('SELECT id, email, name, role, status, companyId FROM User ORDER BY createdAt DESC');

        // Map companies with their users and subscription
        const fullCompaniesData = companies.map(c => {
            const companyUsers = users.filter(u => u.companyId === c.id);
            const subscription = getCompanySubscription(c.id);
            return {
                ...c,
                users: companyUsers,
                subscription
            };
        });

        return NextResponse.json(fullCompaniesData);
    } catch (error) {
        console.error('Control Maestro API Error (GET):', error);
        return NextResponse.json({ error: 'Error interno de la plataforma' }, { status: 500 });
    }
}

// POST: Update subscription for a company
export async function POST(request: Request) {
    try {
        const token = request.headers.get('x-admin-token');
        if (token !== ADMIN_TOKEN) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await request.json();
        const { companyId, plan, estado, fechaFin } = body;

        if (!companyId) {
            return NextResponse.json({ error: 'Falta companyId' }, { status: 400 });
        }

        saveCompanySubscription(companyId, { plan, estado, fechaFin });

        return NextResponse.json({ success: true, message: 'Suscripción actualizada exitosamente' });
    } catch (error) {
        console.error('Control Maestro API Error (POST):', error);
        return NextResponse.json({ error: 'Error interno de la plataforma' }, { status: 500 });
    }
}
