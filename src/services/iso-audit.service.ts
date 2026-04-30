export class ISOAuditService {
  constructor(private dataDir: string) {}
  
  getDashboardKPIs() { return {}; }
  getAllAudits() { return []; }
  getAuditById() { return null; }
  getPrograms() { return []; }
  getAuditors() { return []; }
  getAuditTeam() { return []; }
  getAuditPlan() { return { plan: null, activities: [] }; }
  getFindingsByAudit() { return []; }
  getBulkFindings() { return []; }
  getAllCorrectiveActions() { return []; }
  getBulkVariableAnswers() { return []; }
  saveVariableAnswer() { return true; }
  saveBulkFindings() { return { saved: 0, actionsCreated: 0 }; }
}

let instance: ISOAuditService | null = null;
export function getIsoAuditService(dataDir: string): ISOAuditService {
  if (!instance) instance = new ISOAuditService(dataDir);
  return instance;
}