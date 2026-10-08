import { useEffect, useState } from 'react';
import { ESTILOS_ROL } from '@/utils/roleStyles';
import { useSession } from '@/context/session';
import { actualizarPerfil, cambiarContrasena } from '@/services/usersApi';

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

const getIniciales = (nombre: string, fallback: string): string => {
    const partes = nombre.trim().split(' ').filter(Boolean);
    if (partes.length === 0) return fallback.charAt(0).toUpperCase();
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
};

const REGLAS_CONTRASENA: { test: (value: string) => boolean; message: string }[] = [
    { test: (value) => value.length >= 8, message: 'La contraseña debe tener al menos 8 caracteres.' },
    { test: (value) => /[a-zA-Z]/.test(value), message: 'La contraseña debe contener una letra.' },
    { test: (value) => /[A-Z]/.test(value), message: 'La contraseña debe contener una mayúscula.' },
    { test: (value) => /[0-9]/.test(value), message: 'La contraseña debe contener un número.' },
    { test: (value) => /[^a-zA-Z0-9]/.test(value), message: 'La contraseña debe contener un carácter especial.' },
];

const EditProfilePage = () => {
    const { user, actualizarSesion } = useSession();
    const rolUsuario = user?.rol ?? 'Usuario';

    const [datosPerfil, setDatosPerfil] = useState({
        nombreCompleto: user?.nombre ?? '',
        area: user?.area ?? '',
    });

    const [passwords, setPasswords] = useState({
        actual: '',
        nueva: '',
        confirmar: ''
    });

    const [verPassActual, setVerPassActual] = useState(false);
    const [verPassNueva, setVerPassNueva] = useState(false);
    const [verPassConfirmar, setVerPassConfirmar] = useState(false);

    const [guardandoDatos, setGuardandoDatos] = useState(false);
    const [guardandoPass, setGuardandoPass] = useState(false);
    const [errorDatos, setErrorDatos] = useState<string | null>(null);
    const [errorPass, setErrorPass] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    const handleGuardarDatos = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || guardandoDatos) return;

        const nombre = datosPerfil.nombreCompleto.trim();
        const area = datosPerfil.area.trim();

        if (nombre.length < 3) {
            setErrorDatos('El nombre debe tener al menos 3 caracteres.');
            return;
        }

        if (area.length === 0) {
            setErrorDatos('El área es obligatoria.');
            return;
        }

        setGuardandoDatos(true);
        setErrorDatos(null);

        try {
            const actualizado = await actualizarPerfil(user.id, { nombre, area });
            actualizarSesion(actualizado);
            setDatosPerfil({ nombreCompleto: actualizado.nombre, area: actualizado.area });
            setToast('Datos de perfil actualizados');
        } catch (saveError) {
            setErrorDatos(saveError instanceof Error ? saveError.message : 'No se pudo guardar.');
        } finally {
            setGuardandoDatos(false);
        }
    };

    const handleActualizarContrasena = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || guardandoPass) return;

        if (passwords.nueva !== passwords.confirmar) {
            setErrorPass('Las contraseñas nuevas no coinciden.');
            return;
        }

        const falla = REGLAS_CONTRASENA.find((rule) => !rule.test(passwords.nueva));
        if (falla) {
            setErrorPass(falla.message);
            return;
        }

        setGuardandoPass(true);
        setErrorPass(null);

        try {
            await cambiarContrasena(user.id, {
                actual: passwords.actual,
                nueva: passwords.nueva,
            });
            setPasswords({ actual: '', nueva: '', confirmar: '' });
            setToast('Contraseña actualizada correctamente');
        } catch (saveError) {
            setErrorPass(saveError instanceof Error ? saveError.message : 'No se pudo actualizar la contraseña.');
        } finally {
            setGuardandoPass(false);
        }
    };

    if (!user) return null;

    return (
        <div className="w-full max-w-4xl p-6 mx-auto">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 relative">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold shadow-sm">
                        {user.avatarIniciales || getIniciales(user.nombre, rolUsuario)}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{user.nombre}</h2>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${ESTILOS_ROL[rolUsuario]}`}>
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
                                value={user.correo}
                                disabled
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-slate-50 text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] text-gray-500 mb-1">Cargo</label>
                            <input
                                type="text"
                                value={rolUsuario}
                                disabled
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-slate-50 text-slate-500"
                            />
                        </div>
                    </div>

                    {errorDatos && (
                        <p role="alert" className="mt-4 text-xs font-medium text-red-600">
                            {errorDatos}
                        </p>
                    )}

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={guardandoDatos}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {guardandoDatos ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>

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
                                autoComplete="current-password"
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
                                    autoComplete="new-password"
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
                                    autoComplete="new-password"
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

                    {errorPass && (
                        <p role="alert" className="mb-4 text-xs font-medium text-red-600">
                            {errorPass}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setPasswords({ actual: '', nueva: '', confirmar: '' });
                                setErrorPass(null);
                            }}
                            className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={guardandoPass}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {guardandoPass ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </div>
                </form>
            </div>

            <div className={`fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 transform ${toast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-green-500 rounded-full p-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium">{toast ?? ''}</span>
            </div>

        </div>
    );
}

export { EditProfilePage };
