"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits, markHabitDone, addHabit, clearHabits } from "../store/features/habitSlice";

// URL dinámica
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.habits);
  
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitDesc, setNewHabitDesc] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      dispatch(fetchHabits());
    }
  }, [dispatch]);

  const handleAuth = async (e) => {
    e.preventDefault();
    // Usamos la URL dinámica aquí
    const url = `${API_URL}/api/auth/${authMode}`;
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
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          dispatch(fetchHabits());
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error conectando al servidor");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    dispatch(clearHabits());
  };

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    dispatch(addHabit({ name: newHabitName, description: newHabitDesc }));
    setNewHabitName("");
    setNewHabitDesc("");
  };

  const getProgressBarColor = (percentage) => {
    if (percentage < 33) return "bg-red-500";
    if (percentage < 66) return "bg-yellow-400";
    return "bg-green-500";
  };

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">{authMode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}</h2>
          {authMode === "register" && <input type="text" placeholder="Nombre" required value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 p-3 border rounded" />}
          <input type="email" placeholder="Correo electrónico" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-3 border rounded" />
          <input type="password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-6 p-3 border rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">{authMode === "login" ? "Entrar" : "Registrarse"}</button>
          <p className="mt-4 text-center text-sm text-gray-500 cursor-pointer" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
            {authMode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra"}
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-900">Mis Hábitos</h1>
          <button onClick={handleLogout} className="bg-red-100 text-red-600 px-4 py-2 rounded font-bold">Salir</button>
        </div>

        <form onSubmit={handleCreateHabit} className="bg-white p-6 rounded-xl shadow-md mb-8 border-l-4 border-blue-500 flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Nombre del hábito (Ej. Leer)" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} className="flex-1 p-2 border rounded" required />
          <input type="text" placeholder="Descripción breve" value={newHabitDesc} onChange={(e) => setNewHabitDesc(e.target.value)} className="flex-1 p-2 border rounded" />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Agregar</button>
        </form>

        <div className="space-y-6">
          {list.map((habit) => {
            const progressPercent = Math.min((habit.currentStreak / habit.targetDays) * 100, 100);
            return (
              <div key={habit._id} className="bg-white p-6 rounded-xl shadow border">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1 w-full">
                    <h2 className="text-2xl font-bold">{habit.name}</h2>
                    {habit.description && <p className="text-sm text-gray-500">{habit.description}</p>}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progreso</span>
                        <span>{habit.currentStreak} / {habit.targetDays} días</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${getProgressBarColor(progressPercent)}`} style={{ width: `${progressPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => dispatch(markHabitDone(habit._id)).catch(e => alert(e.message))} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 w-full md:w-auto">
                    Done ✓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}