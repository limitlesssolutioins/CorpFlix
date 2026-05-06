'use client';

import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';

// Simplified data structures for linking
interface LinkableItem {
  id: string;
  name: string;
}

interface NodeLinkerProps {
  node: Node | null;
  onClose: () => void;
  onSave: (nodeId: string, linkedIds: Record<string, string[]>) => void;
}

const NodeLinker = ({ node, onClose, onSave }: NodeLinkerProps) => {
  const [documents, setDocuments] = useState<LinkableItem[]>([]);
  const [indicators, setIndicators] = useState<LinkableItem[]>([]);
  const [risks, setRisks] = useState<LinkableItem[]>([]);
  const [actions, setActions] = useState<LinkableItem[]>([]);
  const [auditReports, setAuditReports] = useState<LinkableItem[]>([]);
  const [roles, setRoles] = useState<LinkableItem[]>([]);
  const [policies, setPolicies] = useState<LinkableItem[]>([]); // New state for policies
  const [objectives, setObjectives] = useState<LinkableItem[]>([]); // New state for objectives

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedAuditReports, setSelectedAuditReports] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]); // New state for selected policies
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]); // New state for selected objectives

  // Fetch all linkable items from localStorage when the component mounts
  useEffect(() => {
    // Fetch documents
    const storedDocs = JSON.parse(localStorage.getItem('documents') || '[]');
    setDocuments(storedDocs.map((d: any) => ({ id: d.id, name: d.name })));

    // Fetch indicators
    const storedKpis = JSON.parse(localStorage.getItem('kpiData') || '[]');
    setIndicators(storedKpis.map((k: any) => ({ id: k.id, name: k.name })));

    // Fetch all types of risks
    const riskKeys = ['corporateRisks', 'healthSafetyRisks', 'environmentalRisks', 'financialRisks', 'organizationalRisks'];
    let allRisks: LinkableItem[] = [];
    riskKeys.forEach(key => {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      allRisks = [...allRisks, ...stored.map((r: any) => ({ id: r.id, name: r.name }))];
    });
    setRisks(allRisks);

    // Fetch all types of actions
    const actionKeys = ['correctiveActions', 'improvementActions', 'preventiveActions'];
    let allActions: LinkableItem[] = [];
    actionKeys.forEach(key => {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      allActions = [...allActions, ...stored.map((a: any) => ({ id: String(a.id), name: a.name }))]; // Convert id to string
    });
    setActions(allActions);

    // Fetch audit reports
    const storedAuditReports = JSON.parse(localStorage.getItem('auditReports') || '[]');
    setAuditReports(storedAuditReports.map((ar: any) => ({ id: String(ar.id), name: ar.name }))); // Convert id to string

    // Fetch roles
    const storedRoles = JSON.parse(localStorage.getItem('companyRoles') || '[]');
    setRoles(storedRoles.map((r: any) => ({ id: String(r.id), name: r.name }))); // Convert id to string

    // Fetch strategic policies and objectives
    const strategicData = JSON.parse(localStorage.getItem('strategicPlanningData') || '{}');
    if (strategicData.policies) {
      setPolicies(strategicData.policies.map((p: any) => ({ id: String(p.id), name: p.text })));
    }
    if (strategicData.objectives) {
      setObjectives(strategicData.objectives.map((o: any) => ({ id: String(o.id), name: o.text })));
    }
  }, []);

  // When a node is selected, populate the selections from its data
  useEffect(() => {
    if (node) {
      setSelectedDocuments(node.data.linkedDocumentIds || []);
      setSelectedIndicators(node.data.linkedIndicatorIds || []);
      setSelectedRisks(node.data.linkedRiskIds || []);
      setSelectedActions(node.data.linkedActionIds || []);
      setSelectedAuditReports(node.data.linkedAuditReportIds || []);
      setSelectedRoles(node.data.linkedRoleIds || []);
      setSelectedPolicies(node.data.linkedPolicyIds || []); // New: populate selected policies
      setSelectedObjectives(node.data.linkedObjectiveIds || []); // New: populate selected objectives
    } else {
      setSelectedDocuments([]);
      setSelectedIndicators([]);
      setSelectedRisks([]);
      setSelectedActions([]);
      setSelectedAuditReports([]);
      setSelectedRoles([]);
      setSelectedPolicies([]);
      setSelectedObjectives([]);
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    onSave(node.id, {
      linkedDocumentIds: selectedDocuments,
      linkedIndicatorIds: selectedIndicators,
      linkedRiskIds: selectedRisks,
      linkedActionIds: selectedActions,
      linkedAuditReportIds: selectedAuditReports,
      linkedRoleIds: selectedRoles,
      linkedPolicyIds: selectedPolicies, // New: save selected policies
      linkedObjectiveIds: selectedObjectives, // New: save selected objectives
    });
    onClose();
  };

  const handleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    if (list.includes(id)) {
      setList(list.filter(itemId => itemId !== id));
    } else {
      setList([...list, id]);
    }
  };

  const renderList = (title: string, items: LinkableItem[], selected: string[], handler: (id: string) => void) => (
    <div className="linker-section">
      <h4 className="linker-title">{title}</h4>
      <ul className="linker-list">
        {items.length > 0 ? items.map(item => (
          <li key={item.id}>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => handler(item.id)}
                className="mr-2"
              />
              {item.name}
            </label>
          </li>
        )) : <p className="text-sm text-gray-500">No hay elementos disponibles.</p>}
      </ul>
    </div>
  );

  return (
    <div className="node-linker-modal">
      <div className="modal-content">
        <h3 className="text-xl font-bold mb-4">Vincular a: {node.data.label}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderList('Documentos', documents, selectedDocuments, (id) => handleSelection(selectedDocuments, setSelectedDocuments, id))}
          {renderList('Indicadores', indicators, selectedIndicators, (id) => handleSelection(selectedIndicators, setSelectedIndicators, id))}
          {renderList('Riesgos', risks, selectedRisks, (id) => handleSelection(selectedRisks, setSelectedRisks, id))}
          {renderList('Acciones de Mejora', actions, selectedActions, (id) => handleSelection(selectedActions, setSelectedActions, id))}
          {renderList('Informes de Auditoría', auditReports, selectedAuditReports, (id) => handleSelection(selectedAuditReports, setSelectedAuditReports, id))}
          {renderList('Roles', roles, selectedRoles, (id) => handleSelection(selectedRoles, setSelectedRoles, id))}
          {renderList('Políticas Estratégicas', policies, selectedPolicies, (id) => handleSelection(selectedPolicies, setSelectedPolicies, id))} {/* New section */}
          {renderList('Objetivos Estratégicos', objectives, selectedObjectives, (id) => handleSelection(selectedObjectives, setSelectedObjectives, id))} {/* New section */}
        </div>
        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={onClose} className="button-secondary">Cancelar</button>
          <button onClick={handleSave} className="feature-button">Guardar Vínculos</button>
        </div>
      </div>
    </div>
  );
};

export default NodeLinker;
