"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHabits } from "../store/features/habitSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.habits);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchHabits());
    }
  }, [status, dispatch]);

  return (
    <main className="min-h-screen p-10 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          Mis Hábitos Atómicos
        </h1>

        {status === "loading" && <p className="text-center">Cargando hábitos...</p>}
        {status === "failed" && <p className="text-red-500 text-center">Error: {error}</p>}

        {status === "succeeded" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.length === 0 ? (
              <p className="text-center col-span-2">No tienes hábitos registrados aún.</p>
            ) : (
              list.map((habit) => (
                <div key={habit._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <h2 className="text-xl font-semibold mb-2">{habit.name}</h2>
                  {habit.description && <p className="text-gray-600 mb-4">{habit.description}</p>}
                  <div className="flex justify-between text-sm">
                    <span className="font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                      Racha: {habit.currentStreak} días
                    </span>
                    <span className="text-gray-500">
                      Meta: {habit.targetDays} días
                    </span>
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