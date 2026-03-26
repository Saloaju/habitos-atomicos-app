"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits } from "../store/features/habitSlice";

export default function Home() {
  const dispatch = useDispatch();
  // Traemos la lista dinámica de hábitos desde Redux
  const { list, status, error } = useSelector((state) => state.habits);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchHabits());
    }
  }, [status, dispatch]);

  return (
    <main className="min-h-screen p-8 bg-gray-100 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10">
          Mis Hábitos Atómicos
        </h1>

        {/* Mensajes de estado de Redux */}
        {status === "loading" && <p className="text-center text-gray-500 animate-pulse">Cargando tus hábitos...</p>}
        {status === "failed" && <p className="text-center text-red-500 font-semibold">Error: {error}</p>}

        {/* Lista dinámica de hábitos */}
        {status === "succeeded" && (
          <div className="space-y-6">
            {list.length === 0 ? (
              <p className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
                No tienes hábitos registrados aún.
              </p>
            ) : (
              list.map((habit) => (
                <div 
                  key={habit._id} 
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-shadow"
                >
                  {/* Información del Hábito */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{habit.name}</h2>
                    {habit.description && (
                      <p className="text-gray-500 text-sm mt-1">{habit.description}</p>
                    )}
                    
                    {/* Barra de Progreso (Estática por ahora según el requerimiento) */}
                    <div className="mt-5">
                      <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
                        <span>Progreso (Estático)</span>
                        <span>{habit.currentStreak} / {habit.targetDays} días</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        {/* La barra está fija al 30% y en color azul. En futuras semanas la haremos dinámica de rojo a verde */}
                        <div 
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                          style={{ width: '30%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Botón "Done" (Sin funcionalidad real por ahora) */}
                  <div className="flex-shrink-0">
                    <button 
                      className="w-full md:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
                      onClick={() => alert("¡Botón presionado! Esta funcionalidad se conectará al backend en las próximas semanas.")}
                    >
                      Done ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}