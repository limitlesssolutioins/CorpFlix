
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function AsistenciaPage() {
    const [employeeId, setEmployeeId] = useState('');
    const [shiftId, setShiftId] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically fetch employee and shift data based on IDs.
        // For now, we'll just simulate a submission.
        console.log({
            employeeId,
            shiftId,
            checkIn,
            checkOut,
            notes,
        });

        // Simulate API call
        try {
            const response = await fetch('/api/gestion/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeId,
                    shiftId,
                    checkIn: checkIn ? new Date(checkIn).toISOString() : null,
                    checkOut: checkOut ? new Date(checkOut).toISOString() : null,
                    notes,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error al registrar asistencia: ${response.statusText}`);
            }

            toast.success('Asistencia registrada exitosamente!');
            // Clear form
            setEmployeeId('');
            setShiftId('');
            setCheckIn('');
            setCheckOut('');
            setNotes('');
        } catch (error: any) {
            toast.error(error.message || 'Error al registrar asistencia');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Registro de Asistencia</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label htmlFor="employeeId" className="block text-slate-700 text-sm font-bold mb-2">
                            ID Empleado:
                        </label>
                        <input
                            type="text"
                            id="employeeId"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="ID del Empleado"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="shiftId" className="block text-slate-700 text-sm font-bold mb-2">
                            ID Turno:
                        </label>
                        <input
                            type="text"
                            id="shiftId"
                            value={shiftId}
                            onChange={(e) => setShiftId(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="ID del Turno (Opcional)"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label htmlFor="checkIn" className="block text-slate-700 text-sm font-bold mb-2">
                            Hora de Entrada (Check-in):
                        </label>
                        <input
                            type="datetime-local"
                            id="checkIn"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="checkOut" className="block text-slate-700 text-sm font-bold mb-2">
                            Hora de Salida (Check-out):
                        </label>
                        <input
                            type="datetime-local"
                            id="checkOut"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="notes" className="block text-slate-700 text-sm font-bold mb-2">
                        Notas:
                    </label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Cualquier observación adicional (ej. Se quedó 2h extra)"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                >
                    Registrar Asistencia
                </button>
            </form>
        </div>
    );
}
