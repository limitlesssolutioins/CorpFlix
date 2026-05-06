import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export const emitKpiUpdate = (companyId: string, module: string) => {
  socket.emit('kpi-update', { companyId, module });
};

export const emitNotification = (companyId: string | null, title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  socket.emit('notification', { companyId, title, message, type });
};

export const emitTaskProgress = (companyId: string, taskId: string, progress: number, message: string, data?: any) => {
  socket.emit('task-progress', { companyId, taskId, progress, message, data });
};
