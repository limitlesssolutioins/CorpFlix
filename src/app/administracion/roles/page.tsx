'use client';

import { useState, useEffect } from 'react';

// Interfaces
interface Role {
  id: number;
  name: string;
  responsibilities: string;
  permissions: string[]; // New field for permissions
  profileDocument?: {
    fileName: string;
    fileDataUrl: string;
    fileType: string;
  };
}

// Define a comprehensive list of QMS permissions
const QMS_PERMISSIONS = [
  // Document Management
  'document.create',
  'document.edit',
  'document.approve',
  'document.publish',
  'document.archive',
  'document.view',

  // Process Management
  'process.create',
  'process.edit',
  'process.view',

  // Audit Management
  'audit.plan',
  'audit.conduct',
  'audit.report',
  'audit.view',

  // Non-Conformity Management
  'nonconformity.create',
  'nonconformity.manage',
  'nonconformity.view',

  // CAPA Management
  'capa.create',
  'capa.manage',
  'capa.view',

  // Risk Management
  'risk.create',
  'risk.manage',
  'risk.view',

  // Indicator Management
  'indicator.input',
  'indicator.view',

  // Training Management
  'training.assign',
  'training.track',
  'training.view',

  // User and Role Management
  'user.manage',
  'role.manage',

  // System Settings
  'settings.manage',
];

// Human-readable labels for permissions
const PERMISSION_LABELS: { [key: string]: string } = {
  'document.create': 'Crear Documento',
  'document.edit': 'Editar Documento',
  'document.approve': 'Aprobar Documento',
  'document.publish': 'Publicar Documento',
  'document.archive': 'Archivar Documento',
  'document.view': 'Ver Documento',

  'process.create': 'Crear Proceso',
  'process.edit': 'Editar Proceso',
  'process.view': 'Ver Proceso',

  'audit.plan': 'Planificar Auditoría',
  'audit.conduct': 'Realizar Auditoría',
  'audit.report': 'Reportar Auditoría',
  'audit.view': 'Ver Auditoría',

  'nonconformity.create': 'Crear No Conformidad',
  'nonconformity.manage': 'Gestionar No Conformidad',
  'nonconformity.view': 'Ver No Conformidad',

  'capa.create': 'Crear CAPA',
  'capa.manage': 'Gestionar CAPA',
  'capa.view': 'Ver CAPA',

  'risk.create': 'Crear Riesgo',
  'risk.manage': 'Gestionar Riesgo',
  'risk.view': 'Ver Riesgo',

  'indicator.input': 'Ingresar Indicador',
  'indicator.view': 'Ver Indicador',

  'training.assign': 'Asignar Capacitación',
  'training.track': 'Seguimiento Capacitación',
  'training.view': 'Ver Capacitación',

  'user.manage': 'Gestionar Usuarios',
  'role.manage': 'Gestionar Roles',

  'settings.manage': 'Gestionar Configuración del Sistema',
};

// Helper function to get human-readable label
const getPermissionLabel = (permission: string) => {
  return PERMISSION_LABELS[permission] || permission;
};

// Group permissions by module for better organization
const PERMISSION_GROUPS = {
  'Gestión de Documentos': [
    'document.create',
    'document.edit',
    'document.approve',
    'document.publish',
    'document.archive',
    'document.view',
  ],
  'Gestión de Procesos': [
    'process.create',
    'process.edit',
    'process.view',
  ],
  'Gestión de Auditorías': [
    'audit.plan',
    'audit.conduct',
    'audit.report',
    'audit.view',
  ],
  'Gestión de No Conformidades': [
    'nonconformity.create',
    'nonconformity.manage',
    'nonconformity.view',
  ],
  'Gestión de CAPA': [
    'capa.create',
    'capa.manage',
    'capa.view',
  ],
  'Gestión de Riesgos': [
    'risk.create',
    'risk.manage',
    'risk.view',
  ],
  'Gestión de Indicadores': [
    'indicator.input',
    'indicator.view',
  ],
  'Gestión de Capacitación': [
    'training.assign',
    'training.track',
    'training.view',
  ],
  'Administración de Usuarios y Roles': [
    'user.manage',
    'role.manage',
  ],
  'Configuración del Sistema': [
    'settings.manage',
  ],
};

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [nextId, setNextId] = useState(1);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [editingRole, setEditingRole] = useState<Role | null>(null); // State to hold role being edited

  // Form state
  const [roleName, setRoleName] = useState('');
  const [roleResponsibilities, setRoleResponsibilities] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [roleProfileFile, setRoleProfileFile] = useState<File | null>(null);

  // Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewFileType, setPreviewFileType] = useState<string | null>(null);

  const [showPermissionsModal, setShowPermissionsModal] = useState(false); // New state for permissions modal
  const [tempSelectedPermissions, setTempSelectedPermissions] = useState<string[]>([]); // For managing selections in modal

  const storageKey = 'companyRoles';

  // Load data
  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      const parsed: Role[] = JSON.parse(storedData);
      setRoles(parsed);
      setNextId((parsed.reduce((max: number, r: Role) => (r.id > max ? r.id : max), 0) || 0) + 1);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(roles));
  }, [roles]);

  const resetForm = () => {
    setRoleName('');
    setRoleResponsibilities('');
    setSelectedPermissions([]);
    setRoleProfileFile(null);
    setEditingRole(null);
    const fileInput = document.getElementById('roleProfileFile') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRoleProfileFile(e.target.files[0]);
    }
  };

  const handlePermissionChange = (permission: string) => {
    setTempSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleOpenPermissionsModal = () => {
    setTempSelectedPermissions([...selectedPermissions]); // Initialize with current selected permissions
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = () => {
    setSelectedPermissions([...tempSelectedPermissions]);
    setShowPermissionsModal(false);
  };

  const handleCancelPermissions = () => {
    setShowPermissionsModal(false);
    setTempSelectedPermissions([]); // Clear temporary selections
  };

  const handleAddUpdateRole = () => {
    if (!roleName.trim()) {
      alert('Por favor, ingrese el nombre del rol.');
      return;
    }

    const processAndSaveRole = (profileDocument?: Role['profileDocument']) => {
      if (editingRole) {
        setRoles(roles.map(role =>
          role.id === editingRole.id
            ? { ...role, name: roleName, responsibilities: roleResponsibilities, permissions: selectedPermissions, profileDocument }
            : role
        ));
        alert(`Rol "${roleName}" actualizado con éxito.`);
      } else {
        const newRole: Role = {
          id: nextId,
          name: roleName,
          responsibilities: roleResponsibilities,
          permissions: selectedPermissions,
          profileDocument,
        };
        setRoles([...roles, newRole]);
        setNextId(nextId + 1);
        alert(`Rol "${roleName}" creado con éxito.`);
      }
      resetForm();
      setShowForm(false);
    };

    if (roleProfileFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const profileDoc = {
          fileName: roleProfileFile.name,
          fileDataUrl: e.target?.result as string,
          fileType: roleProfileFile.type,
        };
        processAndSaveRole(profileDoc);
      };
      reader.readAsDataURL(roleProfileFile);
    } else {
      processAndSaveRole(editingRole?.profileDocument);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleResponsibilities(role.responsibilities);
    setSelectedPermissions(role.permissions);
    setShowForm(true);
  };

  const handleDeleteRole = (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este rol? Esta acción no se puede deshacer.')) {
      setRoles(roles.filter(role => role.id !== id));
      alert('Rol eliminado con éxito.');
    }
  };

  const handlePreview = (role: Role) => {
    if (role.profileDocument) {
      setPreviewContent(role.profileDocument.fileDataUrl);
      setPreviewFileType(role.profileDocument.fileType);
      setShowPreviewModal(true);
    } else {
      alert('No hay documento de perfil para este rol.');
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewContent(null);
    setPreviewFileType(null);
  };

  return (
    <div className="module-container">
      <div className="module-content-card">
        <h1 className="module-title">Módulo: Roles y Responsabilidades</h1>
        <p className="module-description">Defina la estructura de su equipo, los roles y las responsabilidades asociadas a cada uno.</p>

        <div className="mb-6">
          <button onClick={() => { setShowForm(true); resetForm(); }} className="feature-button">Agregar Nuevo Rol</button>
        </div>

        {showForm && (
          <div className="form-section-card mb-8">
            <h2 className="form-section-title">{editingRole ? 'Editar Rol' : 'Crear Nuevo Rol'}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="roleName" className="form-label">Nombre del Rol</label>
                <input type="text" id="roleName" className="form-input" value={roleName} onChange={e => setRoleName(e.target.value)} placeholder="Ej: Gerente de Calidad" />
              </div>
              <div className="form-group full-width">
                <label htmlFor="roleResponsibilities" className="form-label">Responsabilidades Clave</label>
                <textarea id="roleResponsibilities" className="form-textarea" rows={4} value={roleResponsibilities} onChange={e => setRoleResponsibilities(e.target.value)} placeholder="Describa las principales funciones y deberes del rol..." />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Permisos</label>
                <button type="button" onClick={handleOpenPermissionsModal} className="button-secondary mt-2">Seleccionar Permisos ({selectedPermissions.length})</button>
                <div className="selected-permissions-preview mt-2">
                  {selectedPermissions.length > 0 ? (
                    <ul className="permissions-list-inline">
                      {selectedPermissions.map(p => <li key={p}>{getPermissionLabel(p)}</li>)}
                    </ul>
                  ) : (
                    <span className="text-gray-500 text-sm">Ningún permiso seleccionado.</span>
                  )}
                </div>
              </div>
              <div className="form-group full-width">
                <label htmlFor="roleProfileFile" className="form-label">Documento de Perfil de Cargo (Opcional)</label>
                <input type="file" id="roleProfileFile" className="form-input" onChange={handleFileChange} />
                {editingRole?.profileDocument && !roleProfileFile && (
                  <p className="text-sm text-gray-500 mt-2">Archivo actual: {editingRole.profileDocument.fileName} (Subir uno nuevo para reemplazar)</p>
                )}
              </div>
            </div>
            <div className="form-actions mt-6 pt-0 border-t-0">
              <button onClick={handleAddUpdateRole} className="feature-button">{editingRole ? 'Guardar Cambios' : 'Agregar Rol'}</button>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="button-secondary ml-4">Cancelar</button>
            </div>
          </div>
        )}

        {/* Sección para Roles Definidos */}
        <div className="form-section-card">
          <h2 className="form-section-title">Roles Definidos</h2>
          {roles.length === 0 ? <p className="text-gray-600">No hay roles definidos.</p> : (
            <div className="role-list-grid">
              {roles.map(role => (
                <div key={role.id} className="role-card">
                  <h3 className="role-card-title">{role.name}</h3>
                  <p className="role-card-responsibilities"><strong>Responsabilidades:</strong> {role.responsibilities || 'No definidas'}</p>
                  <div className="role-card-permissions">
                    <strong>Permisos:</strong>
                    {role.permissions && role.permissions.length > 0 ? (
                      <ul className="permissions-list">
                        {role.permissions.map(p => <li key={p}>{getPermissionLabel(p)}</li>)}
                      </ul>
                    ) : (
                      <span className="text-gray-500"> No asignados</span>
                    )}
                  </div>
                  {role.profileDocument && (
                    <div className="role-card-document-info">
                      <span><strong>Perfil de Cargo:</strong> {role.profileDocument.fileName}</span>
                      <button onClick={() => handlePreview(role)} className="role-card-preview-button">Previsualizar</button>
                    </div>
                  )}
                  <div className="role-card-actions">
                    <button onClick={() => handleEditRole(role)} className="button-secondary">Editar</button>
                    <button onClick={() => handleDeleteRole(role.id)} className="button-danger ml-2">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={closePreviewModal} className="modal-close-button">&times;</button>
              <h2 className="modal-title">Previsualización del Perfil de Cargo</h2>
              <div className="modal-body">
                {previewFileType?.startsWith('image/') && <img src={previewContent || ''} alt="Preview" className="modal-image-preview" />}
                {previewFileType === 'application/pdf' && <iframe src={previewContent || ''} width="100%" height="500px" style={{ border: 'none' }}></iframe>}
                {previewFileType?.startsWith('text/') && <pre className="modal-text-preview">{atob(previewContent?.split(',')[1] || '')}</pre>}
                {!previewFileType?.startsWith('image/') && !previewFileType?.startsWith('text/') && previewFileType !== 'application/pdf' && <p>Previsualización no soportada.</p>}
              </div>
            </div>
          </div>
        )}

        {/* Permissions Selection Modal */}
        {showPermissionsModal && (
          <div className="modal-overlay">
            <div className="modal-content permissions-modal-content">
              <h2 className="modal-title">Seleccionar Permisos</h2>
              <div className="modal-body permissions-modal-body">
                {Object.entries(PERMISSION_GROUPS).map(([groupName, permissions]) => (
                  <div key={groupName} className="permission-group">
                    <h3 className="permission-group-title">{groupName}</h3>
                    <div className="permissions-grid">
                      {permissions.map(permission => (
                        <div key={permission} className="permission-item">
                          <input
                            type="checkbox"
                            id={permission}
                            checked={tempSelectedPermissions.includes(permission)}
                            onChange={() => handlePermissionChange(permission)}
                            className="permission-checkbox"
                          />
                          <label htmlFor={permission} className="permission-label">{getPermissionLabel(permission)}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button onClick={handleSavePermissions} className="feature-button">Aceptar</button>
                <button onClick={handleCancelPermissions} className="button-secondary ml-2">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesPage;