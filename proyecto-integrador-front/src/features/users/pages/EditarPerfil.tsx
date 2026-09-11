
import { useState } from 'react';

export type Rol = 'Jefe TI' | 'Tecnico' | 'Usuario';

interface EditarPerfilProps {
    rolUsuario: Rol;
}

const IconoOjo = ({ visible }: { visible: boolean }) => (
    visible ? (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    ) : (
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    )
);

export default function EditarPerfil({ rolUsuario }: EditarPerfilProps) {

    const getIniciales = (nombre: string) => {
        const partes = nombre.trim().split(' ');
        if (partes.length === 0 || partes[0] === '') return rolUsuario.charAt(0);
        if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
        return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
    };

    //esto es temporal para modificar con el usuario ingresado
    const [usuarioActual, setUsuarioActual] = useState({
        nombre: 'Ana Torres',
        correo: 'ana.torres@empresa.pe',
        rol: rolUsuario,
        iniciales: getIniciales('Ana Torres')
    });

    const [datosPerfil, setDatosPerfil] = useState({
        nombreCompleto: usuarioActual.nombre,
        area: 'Tecnología de la Información',
        correo: usuarioActual.correo,
        telefono: 'Ext. 201',
        cargo: rolUsuario as string
    });

    const [passwords, setPasswords] = useState({
        actual: '',
        nueva: '',
        confirmar: ''
    });

    const [verPassActual, setVerPassActual] = useState(false);
    const [verPassNueva, setVerPassNueva] = useState(false);
    const [verPassConfirmar, setVerPassConfirmar] = useState(false);

    const [mostrarToastDatos, setMostrarToastDatos] = useState(false);
    const [mostrarToastPass, setMostrarToastPass] = useState(false);

    const handleGuardarDatos = (e: React.FormEvent) => {
        e.preventDefault();
        setUsuarioActual(prev => ({
            ...prev,
            nombre: datosPerfil.nombreCompleto,
            iniciales: getIniciales(datosPerfil.nombreCompleto)
        }));
        setMostrarToastDatos(true);
        setTimeout(() => setMostrarToastDatos(false), 3000);
    };

    const handleActualizarContrasena = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.nueva !== passwords.confirmar) {
            alert("Las contraseñas nuevas no coinciden");
            return;
        }
        setPasswords({ actual: '', nueva: '', confirmar: '' });
        setMostrarToastPass(true);
        setTimeout(() => setMostrarToastPass(false), 3000);
    };

    const getColorRol = (rol: Rol) => {
        if (rol === 'Jefe TI') return 'bg-green-100 text-green-700';
        if (rol === 'Usuario') return 'bg-orange-100 text-orange-600';
        return 'bg-green-50 text-green-600';
    };

    return (
        <div className="w-full max-w-4xl p-6 mx-auto">

            {/* TARJETA DATOS */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 relative">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold shadow-sm">
                        {usuarioActual.iniciales}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{usuarioActual.nombre}</h2>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${getColorRol(rolUsuario)}`}>
                            {rolUsuario}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleGuardarDatos}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label className="block text-[11px] text-gray-500 mb-1">Nombre completo</label>
                            <input
                                type="text"
                                value={datosPerfil.nombreCompleto}
                                onChange={(e) => setDatosPerfil({ ...datosPerfil, nombreCompleto: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] text-gray-500 mb-1">Área/Departamento</label>
                            <input
                                type="text"
                                value={datosPerfil.area}
                                onChange={(e) => setDatosPerfil({ ...datosPerfil, area: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] text-gray-500 mb-1">Correo electrónico</label>
                            <input
                                type="email"
                                value={datosPerfil.correo}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] text-gray-500 mb-1">Telefono interno</label>
                            <input
                                type="text"
                                value={datosPerfil.telefono}
                                onChange={(e) => setDatosPerfil({ ...datosPerfil, telefono: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] text-gray-500 mb-1">Cargo</label>
                            <input
                                type="text"
                                value={datosPerfil.cargo}
                                onChange={(e) => setDatosPerfil({ ...datosPerfil, cargo: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button type="submit" className="bg-[#2F80ED] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>

            {/* CONTRASEÑA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="font-bold text-gray-900 text-sm mb-5">Cambiar contraseña</h3>

                <form onSubmit={handleActualizarContrasena}>
                    <div className="mb-5">
                        <label className="block text-[11px] text-gray-500 mb-1">Contraseña actual</label>
                        <div className="relative w-full md:w-[calc(50%-12px)]">
                            <input
                                type={verPassActual ? "text" : "password"}
                                value={passwords.actual}
                                onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })}
                                placeholder="••••••••••••"
                                required
                                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                            />
                            <button
                                type="button"
                                onMouseDown={() => setVerPassActual(true)}
                                onMouseUp={() => setVerPassActual(false)}
                                onMouseLeave={() => setVerPassActual(false)}
                                onTouchStart={() => setVerPassActual(true)}
                                onTouchEnd={() => setVerPassActual(false)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                <IconoOjo visible={verPassActual} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-[11px] text-gray-500 mb-1">Nueva contraseña</label>
                            <div className="relative">
                                <input
                                    type={verPassNueva ? "text" : "password"}
                                    value={passwords.nueva}
                                    onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setVerPassNueva(true)}
                                    onMouseUp={() => setVerPassNueva(false)}
                                    onMouseLeave={() => setVerPassNueva(false)}
                                    onTouchStart={() => setVerPassNueva(true)}
                                    onTouchEnd={() => setVerPassNueva(false)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    <IconoOjo visible={verPassNueva} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] text-gray-500 mb-1">Confirmar contraseña</label>
                            <div className="relative">
                                <input
                                    type={verPassConfirmar ? "text" : "password"}
                                    value={passwords.confirmar}
                                    onChange={(e) => setPasswords({ ...passwords, confirmar: e.target.value })}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-700"
                                />
                                <button
                                    type="button"
                                    onMouseDown={() => setVerPassConfirmar(true)}
                                    onMouseUp={() => setVerPassConfirmar(false)}
                                    onMouseLeave={() => setVerPassConfirmar(false)}
                                    onTouchStart={() => setVerPassConfirmar(true)}
                                    onTouchEnd={() => setVerPassConfirmar(false)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    <IconoOjo visible={verPassConfirmar} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setPasswords({ actual: '', nueva: '', confirmar: '' })}
                            className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="bg-[#2F80ED] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Actualizar contraseña
                        </button>
                    </div>
                </form>
            </div>

            {/* TOASTS */}
            <div className={`fixed bottom-6 right-6 z-50 bg-[#1A202C] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 transform ${mostrarToastDatos ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-green-500 rounded-full p-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium">Datos de perfil actualizados</span>
            </div>

            <div className={`fixed bottom-6 right-6 z-50 bg-[#1A202C] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 transform ${mostrarToastPass ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-green-500 rounded-full p-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium">Contraseña actualizada correctamente</span>
            </div>

        </div>
    );
}