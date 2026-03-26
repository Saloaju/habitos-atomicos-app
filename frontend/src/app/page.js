"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits, markHabitDone } from "../store/features/habitSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.habits);
  
  // Estado local para simular si el usuario está logueado o no
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // 'login' o 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user && status === "idle") {
      dispatch(fetchHabits());
    }
  }, [user, status, dispatch]);

  // Función para manejar Login y Registro
  const handleAuth = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/api/auth/${authMode}`;
    const body = authMode === "register" ? { name, email, password } : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (res.ok) {
        if (authMode === "register") {
          alert("Registrado! Ahora inicia sesión.");
          setAuthMode("login");
        } else {
          setUser(data.user); // Guardamos sesión
          dispatch(fetchHabits()); // Forzamos carga de hábitos
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error conectando al servidor");
    }
  };

  // Función que calcula el color de la barra dinámica
  const getProgressBarColor = (percentage) => {
    if (percentage < 33) return "bg-red-500";
    if (percentage < 66) return "bg-yellow-400";
    return "bg-green-500";
  };

  // --- PANTALLA DE LOGIN / REGISTRO ---
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
            {authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          {authMode === "register" && (
            <input type="text" placeholder="Nombre" required value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 p-3 border rounded" />
          )}
          <input type="email" placeholder="Correo electrónico" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-3 border rounded" />
          <input type="password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 p-3 border rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
            {authMode === "login" ? "Entrar" : "Registrarse"}
          </button>
          <p className="mt-4 text-center text-sm text-gray-500 cursor-pointer" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
            {authMode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra"}
          </p>
        </form>
      </main>
    );
  }

  // --- PANTALLA DE HÁBITOS (Si está logueado) ---
  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900">Mis Hábitos Atómicos</h1>
          <button onClick={() => setUser(null)} className="text-sm bg-red-100 text-red-600 px-4 py-2 rounded font-bold">Salir</button>
        </div>

        <div className="space-y-6">
          {list.map((habit) => {
            // Lógica para la barra dinámica
            const progressPercent = Math.min((habit.currentStreak / habit.targetDays) * 100, 100);
            
            return (
              <div key={habit._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{habit.name}</h2>
                    <div className="mt-5">
                      <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                        <span>Progreso Dinámico</span>
                        <span>{habit.currentStreak} / {habit.targetDays} días</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        {/* Barra dinámica que cambia de color y ancho */}
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${getProgressBarColor(progressPercent)}`} 
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón Done Funcional */}
                  <div className="flex-shrink-0">
                    <button 
                      className="px-8 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold rounded-lg transition-colors focus:ring-4 focus:ring-green-300"
                      onClick={() => dispatch(markHabitDone(habit._id)).catch(e => alert(e.message))}
                    >
                      Done ✓
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}