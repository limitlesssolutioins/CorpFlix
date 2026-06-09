import { NextResponse } from 'next/server';
import { getCompanyId } from '@/lib/companyContext';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const companyId = await getCompanyId();
        if (!companyId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const sql = `
            SELECT s.*, 
                   (SELECT COUNT(*) FROM AuditChapter c WHERE c.standardId = s.id) as chaptersCount,
                   (SELECT COUNT(*) FROM Audit a WHERE a.standard_id = s.id AND a.companyId = ?) as totalAudits,
                   (SELECT id FROM Audit a WHERE a.standard_id = s.id AND a.companyId = ? ORDER BY a.date DESC LIMIT 1) as latestAuditId
            FROM AuditStandard s 
            ORDER BY s.id ASC
        `;
        const standards = await query<any[]>(sql, [companyId, companyId]);
        
        // Map to match old API format expectations if necessary.
        const mappedStandards = standards.map(s => ({
            id: s.id,
            code: s.code,
            name: s.name,
            full_name: s.fullName,
            category: s.category,
            color: s.color,
            description: s.description,
            total_requirements: s.chaptersCount,
            total_audits: s.totalAudits || 0,
            latest_audit_id: s.latestAuditId || null
        }));

        return NextResponse.json(mappedStandards);
    } catch (error) {
        console.error('Error fetching standards:', error);
        return NextResponse.json({ error: 'Failed to fetch standards' }, { status: 500 });
    }
}
