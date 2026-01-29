import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'src/data/riesgos.db');
const SCHEMA_PATH = path.join(process.cwd(), 'src/data/schema_riesgos.sql');

// Types
export interface RiskCategory {
    id?: number;
    code: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
}

export interface Risk {
    id?: number;
    category_id: number;
    code?: string;
    type?: string;
    description: string;
    caused_by?: string;
    impact?: string;
    related_activity?: string;
    related_process?: string;
    status?: string;
}

export interface RiskAssessment {
    id?: number;
    risk_id: number;
    assessment_date: string;
    assessed_by?: number;
    probability: number;
    consequence: number;
    inherent_risk?: number;
    conversion_factor?: number;
    inherent_risk_level?: string;
    residual_risk_level?: string;
    priority?: string;
    significance?: string;
    acceptability?: string;
    notes?: string;
}

export interface RiskControl {
    id?: number;
    assessment_id: number;
    description: string;
    control_type?: string;
    effectiveness?: number;
    effectiveness_level?: string;
    responsible?: string;
    implementation_date?: string;
    review_date?: string;
    status?: string;
    notes?: string;
}

export interface ActionPlan {
    id?: number;
    assessment_id: number;
    action_description: string;
    responsible?: string;
    start_date?: string;
    target_date?: string;
    completion_date?: string;
    status?: string;
    progress?: number;
    budget?: number;
    actual_cost?: number;
    verification_method?: string;
    notes?: string;
}

class RiskService {
    private db: Database.Database;

    constructor() {
        // Crear directorio si no existe
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Inicializar base de datos
        this.db = new Database(DB_PATH);
        this.initializeDatabase();
    }

    private initializeDatabase() {
        try {
            // Verificar si las tablas ya existen
            const tableExists = this.db
                .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='risk_categories'")
                .get();

            if (!tableExists) {
                // Ejecutar script SQL de inicialización
                const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
                this.db.exec(schema);
                console.log('✅ Risk database initialized successfully');
            }
        } catch (error) {
            console.error('❌ Error initializing risk database:', error);
            throw error;
        }
    }

    // =======================
    // RISK CATEGORIES
    // =======================

    getAllCategories(): RiskCategory[] {
        return this.db
            .prepare('SELECT * FROM risk_categories ORDER BY name')
            .all() as RiskCategory[];
    }

    getCategoryById(id: number): RiskCategory | undefined {
        return this.db
            .prepare('SELECT * FROM risk_categories WHERE id = ?')
            .get(id) as RiskCategory | undefined;
    }

    getCategoryByCode(code: string): RiskCategory | undefined {
        return this.db
            .prepare('SELECT * FROM risk_categories WHERE code = ?')
            .get(code) as RiskCategory | undefined;
    }

    // =======================
    // RISK CATALOG (RISKS)
    // =======================

    getAllRisks(filters?: { category_id?: number; status?: string }): Risk[] {
        let query = 'SELECT * FROM risks WHERE 1=1';
        const params: any[] = [];

        if (filters?.category_id) {
            query += ' AND category_id = ?';
            params.push(filters.category_id);
        }

        if (filters?.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY created_at DESC';

        return this.db.prepare(query).all(...params) as Risk[];
    }

    getRiskById(id: number): Risk | undefined {
        return this.db
            .prepare('SELECT * FROM risks WHERE id = ?')
            .get(id) as Risk | undefined;
    }

    createRisk(risk: Risk): Risk {
        const stmt = this.db.prepare(`
      INSERT INTO risks (category_id, code, type, description, caused_by, impact, 
                         related_activity, related_process, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            risk.category_id,
            risk.code || null,
            risk.type || null,
            risk.description,
            risk.caused_by || null,
            risk.impact || null,
            risk.related_activity || null,
            risk.related_process || null,
            risk.status || 'ACTIVE'
        );

        return this.getRiskById(result.lastInsertRowid as number)!;
    }

    updateRisk(id: number, risk: Partial<Risk>): Risk | null {
        const existing = this.getRiskById(id);
        if (!existing) return null;

        const stmt = this.db.prepare(`
      UPDATE risks 
      SET category_id = ?, code = ?, type = ?, description = ?, caused_by = ?, 
          impact = ?, related_activity = ?, related_process = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(
            risk.category_id ?? existing.category_id,
            risk.code ?? existing.code ?? null,
            risk.type ?? existing.type ?? null,
            risk.description ?? existing.description,
            risk.caused_by ?? existing.caused_by ?? null,
            risk.impact ?? existing.impact ?? null,
            risk.related_activity ?? existing.related_activity ?? null,
            risk.related_process ?? existing.related_process ?? null,
            risk.status ?? existing.status,
            id
        );

        return this.getRiskById(id)!;
    }

    deleteRisk(id: number): boolean {
        const result = this.db.prepare('DELETE FROM risks WHERE id = ?').run(id);
        return result.changes > 0;
    }

    // =======================
    // RISK ASSESSMENTS
    // =======================

    getAllAssessments(filters?: { risk_id?: number }): any[] {
        let query = `
      SELECT ra.*, r.description as risk_description, r.type as risk_type,
             rc.name as category_name, rc.code as category_code
      FROM risk_assessments ra
      INNER JOIN risks r ON ra.risk_id = r.id
      INNER JOIN risk_categories rc ON r.category_id = rc.id
      WHERE 1=1
    `;
        const params: any[] = [];

        if (filters?.risk_id) {
            query += ' AND ra.risk_id = ?';
            params.push(filters.risk_id);
        }

        query += ' ORDER BY ra.assessment_date DESC';

        return this.db.prepare(query).all(...params);
    }

    getAssessmentById(id: number): any {
        return this.db
            .prepare(`
        SELECT ra.*, r.description as risk_description, r.type as risk_type,
               rc.name as category_name, rc.code as category_code
        FROM risk_assessments ra
        INNER JOIN risks r ON ra.risk_id = r.id
        INNER JOIN risk_categories rc ON r.category_id = rc.id
        WHERE ra.id = ?
      `)
            .get(id);
    }

    createAssessment(assessment: RiskAssessment): any {
        // Calcular riesgo inherente y nivel
        const inherentRisk = assessment.probability * assessment.consequence;
        const matrixRow = this.db
            .prepare('SELECT * FROM risk_matrix WHERE inherent_risk = ?')
            .get(inherentRisk) as any;

        const conversionFactor = matrixRow?.conversion_factor || 3;
        const inherentRiskLevel = matrixRow?.level_name || 'MEDIO';

        const stmt = this.db.prepare(`
      INSERT INTO risk_assessments (
        risk_id, assessment_date, assessed_by, probability, consequence,
        inherent_risk, conversion_factor, inherent_risk_level,
        residual_risk_level, priority, significance, acceptability,
        condition_normal, condition_abnormal, condition_emergency,
        condition_routine, condition_non_routine,
        exposed_permanent, exposed_temporary, exposed_contractor, exposed_visitor,
        notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            assessment.risk_id,
            assessment.assessment_date,
            assessment.assessed_by || null,
            assessment.probability,
            assessment.consequence,
            inherentRisk,
            conversionFactor,
            inherentRiskLevel,
            assessment.residual_risk_level || 'PENDING',
            assessment.priority || 'NO PRIORITARIO',
            assessment.significance || 'NO SIGNIFICATIVO',
            assessment.acceptability || 'ALERTA',
            0, 0, 0, 0, 0, // condiciones
            0, 0, 0, 0, // exposición
            assessment.notes || null,
            'ACTIVE'
        );

        return this.getAssessmentById(result.lastInsertRowid as number);
    }

    updateAssessmentAfterControls(assessmentId: number): any {
        // Obtener controles y calcular efectividad promedio
        const controls = this.db
            .prepare('SELECT effectiveness FROM risk_controls WHERE assessment_id = ? AND status = ?')
            .all(assessmentId, 'ACTIVE') as any[];

        if (controls.length === 0) {
            return this.getAssessmentById(assessmentId);
        }

        const avgEffectiveness =
            controls.reduce((sum, c) => sum + (c.effectiveness || 0), 0) / controls.length;

        // Determinar nivel residual basado en eficacia
        let residualLevel = 'NO ACEPTABLE/PRIORITARIO/SIGNIFICATIVO';
        let acceptability = 'NO ACEPTABLE';
        let priority = 'PRIORITARIO';
        let significance = 'SIGNIFICATIVO';

        if (avgEffectiveness >= 4) {
            residualLevel = 'ACEPTABLE/NO PRIORITARIO/NO SIGNIFICATIVO';
            acceptability = 'ACEPTABLE';
            priority = 'NO PRIORITARIO';
            significance = 'NO SIGNIFICATIVO';
        } else if (avgEffectiveness >= 2.5) {
            residualLevel = 'ALERTA/NO PRIORITARIO/NO SIGNIFICATIVO';
            acceptability = 'ALERTA';
            priority = 'NO PRIORITARIO';
            significance = 'NO SIGNIFICATIVO';
        }

        const stmt = this.db.prepare(`
      UPDATE risk_assessments
      SET residual_risk_level = ?, acceptability = ?, priority = ?, significance = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(residualLevel, acceptability, priority, significance, assessmentId);

        return this.getAssessmentById(assessmentId);
    }

    // =======================
    // RISK CONTROLS
    // =======================

    getControlsByAssessment(assessmentId: number): RiskControl[] {
        return this.db
            .prepare('SELECT * FROM risk_controls WHERE assessment_id = ? ORDER BY created_at')
            .all(assessmentId) as RiskControl[];
    }

    createControl(control: RiskControl): RiskControl {
        // Determinar nivel de eficacia
        const effectivenessLevel = this.getEffectivenessLevel(control.effectiveness || 3);

        const stmt = this.db.prepare(`
      INSERT INTO risk_controls (
        assessment_id, description, control_type, effectiveness, effectiveness_level,
        responsible, implementation_date, review_date, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            control.assessment_id,
            control.description,
            control.control_type || 'PREVENTIVO',
            control.effectiveness || 3,
            effectivenessLevel,
            control.responsible || null,
            control.implementation_date || null,
            control.review_date || null,
            control.status || 'ACTIVE',
            control.notes || null
        );

        // Actualizar assessment después de agregar control
        this.updateAssessmentAfterControls(control.assessment_id);

        const createdControl = this.db
            .prepare('SELECT * FROM risk_controls WHERE id = ?')
            .get(result.lastInsertRowid) as RiskControl;

        return createdControl;
    }

    private getEffectivenessLevel(effectiveness: number): string {
        if (effectiveness === 1) return 'MUY ALTA';
        if (effectiveness === 2) return 'ALTA';
        if (effectiveness === 3) return 'MEDIA';
        if (effectiveness === 4) return 'BAJA';
        return 'MUY BAJA';
    }

    // =======================
    // ACTION PLANS
    // =======================

    getActionPlansByAssessment(assessmentId: number): ActionPlan[] {
        return this.db
            .prepare('SELECT * FROM action_plans WHERE assessment_id = ? ORDER BY target_date')
            .all(assessmentId) as ActionPlan[];
    }

    getAllActionPlans(filters?: { status?: string }): any[] {
        let query = `
      SELECT ap.*, ra.inherent_risk_level, r.description as risk_description, 
             rc.name as category_name
      FROM action_plans ap
      INNER JOIN risk_assessments ra ON ap.assessment_id = ra.id
      INNER JOIN risks r ON ra.risk_id = r.id
      INNER JOIN risk_categories rc ON r.category_id = rc.id
      WHERE 1=1
    `;
        const params: any[] = [];

        if (filters?.status) {
            query += ' AND ap.status = ?';
            params.push(filters.status);
        }

        query += ' ORDER BY ap.target_date ASC';

        return this.db.prepare(query).all(...params);
    }

    createActionPlan(plan: ActionPlan): ActionPlan {
        const stmt = this.db.prepare(`
      INSERT INTO action_plans (
        assessment_id, action_description, responsible, start_date, target_date,
        completion_date, status, progress, budget, actual_cost, verification_method, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            plan.assessment_id,
            plan.action_description,
            plan.responsible || null,
            plan.start_date || null,
            plan.target_date || null,
            plan.completion_date || null,
            plan.status || 'PENDING',
            plan.progress || 0,
            plan.budget || null,
            plan.actual_cost || null,
            plan.verification_method || null,
            plan.notes || null
        );

        return this.db
            .prepare('SELECT * FROM action_plans WHERE id = ?')
            .get(result.lastInsertRowid) as ActionPlan;
    }

    updateActionPlan(id: number, plan: Partial<ActionPlan>): ActionPlan | null {
        const existing = this.db
            .prepare('SELECT * FROM action_plans WHERE id = ?')
            .get(id) as ActionPlan | undefined;

        if (!existing) return null;

        const stmt = this.db.prepare(`
      UPDATE action_plans
      SET action_description = ?, responsible = ?, start_date = ?, target_date = ?,
          completion_date = ?, status = ?, progress = ?, budget = ?, actual_cost = ?,
          verification_method = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

        stmt.run(
            plan.action_description ?? existing.action_description,
            plan.responsible ?? existing.responsible,
            plan.start_date ?? existing.start_date,
            plan.target_date ?? existing.target_date,
            plan.completion_date ?? existing.completion_date,
            plan.status ?? existing.status,
            plan.progress ?? existing.progress,
            plan.budget ?? existing.budget,
            plan.actual_cost ?? existing.actual_cost,
            plan.verification_method ?? existing.verification_method,
            plan.notes ?? existing.notes,
            id
        );

        return this.db
            .prepare('SELECT * FROM action_plans WHERE id = ?')
            .get(id) as ActionPlan;
    }

    // =======================
    // DASHBOARD & ANALYTICS
    // =======================

    getDashboardKPIs() {
        const totalRisks = this.db
            .prepare('SELECT COUNT(*) as count FROM risks WHERE status = ?')
            .get('ACTIVE') as any;

        const totalAssessments = this.db
            .prepare('SELECT COUNT(*) as count FROM risk_assessments WHERE status = ?')
            .get('ACTIVE') as any;

        const criticalRisks = this.db
            .prepare(`
        SELECT COUNT(*) as count FROM risk_assessments 
        WHERE status = 'ACTIVE' AND acceptability = 'NO ACEPTABLE'
      `)
            .get() as any;

        const risksByCategory = this.db
            .prepare(`
        SELECT rc.name, rc.code, rc.color, COUNT(r.id) as count
        FROM risk_categories rc
        LEFT JOIN risks r ON rc.id = r.category_id AND r.status = 'ACTIVE'
        GROUP BY rc.id
      `)
            .all();

        const risksByLevel = this.db
            .prepare(`
        SELECT inherent_risk_level as level, COUNT(*) as count
        FROM risk_assessments
        WHERE status = 'ACTIVE'
        GROUP BY inherent_risk_level
      `)
            .all();

        const risksByAcceptability = this.db
            .prepare(`
        SELECT acceptability, COUNT(*) as count
        FROM risk_assessments
        WHERE status = 'ACTIVE'
        GROUP BY acceptability
      `)
            .all();

        const pendingActions = this.db
            .prepare(`
        SELECT COUNT(*) as count FROM action_plans
        WHERE status IN ('PENDING', 'IN_PROGRESS')
      `)
            .get() as any;

        return {
            totalRisks: totalRisks.count,
            totalAssessments: totalAssessments.count,
            criticalRisks: criticalRisks.count,
            pendingActions: pendingActions.count,
            risksByCategory,
            risksByLevel,
            risksByAcceptability
        };
    }

    // =======================
    // IMPORT FROM CATALOGS
    // =======================

    importRisksFromCatalog(categoryCode: string, catalogPath: string): number {
        try {
            const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
            const category = this.getCategoryByCode(categoryCode);

            if (!category) {
                throw new Error(`Category ${categoryCode} not found`);
            }

            // Insertar criterios de consecuencia si existen
            if (catalog.consequence_criteria) {
                for (const criteria of catalog.consequence_criteria) {
                    const existing = this.db
                        .prepare('SELECT id FROM consequence_criteria WHERE category_id = ? AND level = ?')
                        .get(category.id, criteria.level);

                    if (!existing) {
                        this.db
                            .prepare(
                                'INSERT INTO consequence_criteria (category_id, level, name, description) VALUES (?, ?, ?, ?)'
                            )
                            .run(category.id, criteria.level, criteria.name, criteria.description);
                    }
                }
            }

            // Insertar riesgos
            let count = 0;
            for (const risk of catalog.risks) {
                this.createRisk({
                    category_id: category.id!,
                    type: risk.type,
                    description: risk.description,
                    caused_by: risk.caused_by,
                    impact: risk.impact,
                    status: 'ACTIVE'
                });
                count++;
            }

            return count;
        } catch (error) {
            console.error(`Error importing catalog from ${catalogPath}:`, error);
            throw error;
        }
    }
}

export const riskService = new RiskService();
