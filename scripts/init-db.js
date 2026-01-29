const { PrismaClient } = require('@prisma/client');

async function main() {
    console.log('🔄 Initializing database...');

    const prisma = new PrismaClient();

    try {
        // Test connection
        await prisma.$connect();
        console.log('✅ Database connected successfully!');

        // Create initial system configuration
        const config = await prisma.systemConfiguration.upsert({
            where: { id: 'default' },
            update: {},
            create: {
                id: 'default',
                companyName: 'LIDUS',
                city: 'Cartagena',
                currentYear: 2026,
                smlmv: 1423500,
                transportAid: 200000,
                paymentFrequency: 'MONTHLY',
                taxRegime: 'Régimen Común'
            }
        });

        console.log('✅ System configuration created:', config.companyName);

        // Create default absence types
        const absenceTypes = [
            { code: 'EG', name: 'Enfermedad General', paidBy: 'EPS', percentage: 66.67, affectsTransportAid: true },
            { code: 'AT', name: 'Accidente de Trabajo', paidBy: 'ARL', percentage: 100, affectsTransportAid: false },
            { code: 'LM', name: 'Licencia de Maternidad', paidBy: 'EPS', percentage: 100, affectsTransportAid: false },
            { code: 'LP', name: 'Licencia de Paternidad', paidBy: 'EPS', percentage: 100, affectsTransportAid: false },
            { code: 'LNR', name: 'Licencia No Remunerada', paidBy: 'NINGUNO', percentage: 0, affectsTransportAid: true },
            { code: 'VAC', name: 'Vacaciones', paidBy: 'EMPLEADOR', percentage: 100, affectsTransportAid: false }
        ];

        for (const type of absenceTypes) {
            await prisma.absenceType.upsert({
                where: { code: type.code },
                update: type,
                create: type
            });
        }

        console.log('✅ Absence types created');

        console.log('🎉 Database initialization complete!');

    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
