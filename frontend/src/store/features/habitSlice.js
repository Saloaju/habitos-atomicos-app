import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Petición GET: Obtener todos los hábitos
export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  const response = await fetch('http://localhost:5000/api/habits');
  if (!response.ok) {
    throw new Error('Error al cargar los hábitos');
  }
  return await response.json();
});

// 2. Petición PATCH: Marcar hábito como realizado / Lógica de racha (NUEVO SEMANA 4)
export const markHabitDone = createAsyncThunk('habits/markHabitDone', async (habitId) => {
  const response = await fetch(`http://localhost:5000/api/habits/${habitId}/check`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  
  // Si el backend nos lanza un error (ej. "Ya completaste este hábito hoy")
  if (!response.ok) {
    throw new Error(data.message || 'Error al actualizar el hábito');
  }
  
  // Si todo sale bien, retornamos el hábito con su racha actualizada
  return data; 
});

const habitSlice = createSlice({
  name: 'habits',
  initialState: {
    list: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Estados para fetchHabits (Cargar la lista inicial) ---
      .addCase(fetchHabits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; // Guardamos todos los hábitos en el estado
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // --- Estados para markHabitDone (Al presionar el botón Done) ---
      .addCase(markHabitDone.fulfilled, (state, action) => {
        // Buscamos el hábito específico en nuestra lista de Redux...
        const index = state.list.findIndex(habit => habit._id === action.payload._id);
        if (index !== -1) {
          // ...y lo reemplazamos con la versión actualizada que nos mandó el backend
          state.list[index] = action.payload;
        }
      })
      .addCase(markHabitDone.rejected, (state, action) => {
        // Si hay un error (ej. botón presionado 2 veces el mismo día), lo podemos guardar
        state.error = action.error.message;
      });
  }
});

export default habitSlice.reducer;