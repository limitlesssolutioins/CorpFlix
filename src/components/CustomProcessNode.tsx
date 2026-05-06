'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FaFileAlt, FaChartLine, FaExclamationTriangle, FaTasks, FaClipboardList, FaUserTie, FaLightbulb, FaBullseye } from 'react-icons/fa';

interface CustomNodeData {
  label: string;
  linkedDocumentIds?: string[];
  linkedIndicatorIds?: string[];
  linkedRiskIds?: string[];
  linkedActionIds?: string[];
  linkedAuditReportIds?: string[];
  linkedRoleIds?: string[];
  linkedPolicyIds?: string[]; // New: for linked policies
  linkedObjectiveIds?: string[]; // New: for linked objectives
}

interface CustomProcessNodeProps extends NodeProps<CustomNodeData> {
  onChange: (id: string, newLabel: string) => void;
  onDelete: (id: string) => void; // New prop for delete handler
}

const CustomProcessNode = ({ data, id, isConnectable, onChange, onDelete }: CustomProcessNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(data.label);

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event from propagating to ReactFlow
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(id, labelText);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
      event.currentTarget.blur(); // Trigger blur to save
    }
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event from propagating to ReactFlow
    if (confirm('¿Está seguro de que desea eliminar este nodo?')) {
      onDelete(id);
    }
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="node-label" onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <input
            type="text"
            value={labelText}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            autoFocus
            className="node-label-input"
          />
        ) : (
          labelText
        )}
      </div>
      <div className="node-links">
        {data.linkedDocumentIds && data.linkedDocumentIds.length > 0 && (
          <span className="link-icon" title="Documentos Vinculados">
            <FaFileAlt />
          </span>
        )}
        {data.linkedIndicatorIds && data.linkedIndicatorIds.length > 0 && (
          <span className="link-icon" title="Indicadores Vinculados">
            <FaChartLine />
          </span>
        )}
        {data.linkedRiskIds && data.linkedRiskIds.length > 0 && (
          <span className="link-icon" title="Riesgos Vinculados">
            <FaExclamationTriangle />
          </span>
        )}
        {data.linkedActionIds && data.linkedActionIds.length > 0 && (
          <span className="link-icon" title="Acciones Vinculadas">
            <FaTasks />
          </span>
        )}
        {data.linkedAuditReportIds && data.linkedAuditReportIds.length > 0 && (
          <span className="link-icon" title="Informes de Auditoría Vinculados">
            <FaClipboardList />
          </span>
        )}
        {data.linkedRoleIds && data.linkedRoleIds.length > 0 && (
          <span className="link-icon" title="Roles Vinculados">
            <FaUserTie />
          </span>
        )}
        {data.linkedPolicyIds && data.linkedPolicyIds.length > 0 && (
          <span className="link-icon" title="Políticas Vinculadas">
            <FaLightbulb />
          </span>
        )}
        {data.linkedObjectiveIds && data.linkedObjectiveIds.length > 0 && (
          <span className="link-icon" title="Objetivos Vinculados">
            <FaBullseye />
          </span>
        )} {/* New: Policy and Objective icons */}
      </div>
      <button 
        type="button" 
        onClick={handleDeleteClick} 
        className="node-delete-button" 
        title="Eliminar Nodo"
      >
        &times;
      </button>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default CustomProcessNode;
