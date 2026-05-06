'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emit: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, companyId }: { children: React.ReactNode, companyId?: string | null }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // En producción esto se conectará a la misma URL de la app
    const socketInstance = io();

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado a WebSockets');
      
      if (companyId) {
        socketInstance.emit('join-company', companyId);
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [companyId]);

  const emit = (event: string, data: any) => {
    if (socket) socket.emit(event, data);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, emit }}>
      {children}
    </SocketContext.Provider>
  );
};
