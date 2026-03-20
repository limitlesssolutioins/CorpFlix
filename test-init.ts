import { getIsoAuditService } from './src/services/iso-audit.service';
try {
  const s = getIsoAuditService('./test-db-dir');
  console.log("Successfully initialized DB");
} catch(e) {
  console.error("FAILED", e);
}
