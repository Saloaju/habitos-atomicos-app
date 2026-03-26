import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Función auxiliar para obtener el token de localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Aquí adjuntamos el gafete (JWT)
  };
};

export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  const response = await fetch('http://localhost:5000/api/habits', {
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al cargar los hábitos');
  return await response.json();
});

export const addHabit = createAsyncThunk('habits/addHabit', async (habitData) => {
  const response = await fetch('http://localhost:5000/api/habits', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(habitData)
  });
  if (!response.ok) throw new Error('Error al crear el hábito');
  return await response.json();
});

export const markHabitDone = createAsyncThunk('habits/markHabitDone', async (habitId) => {
  const response = await fetch(`http://localhost:5000/api/habits/${habitId}/check`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al actualizar');
  return data;
});

const habitSlice = createSlice({
  name: 'habits',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    clearHabits: (state) => { state.list = []; state.status = 'idle'; } // Para borrar al cerrar sesión
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(addHabit.fulfilled, (state, action) => {
        state.list.push(action.payload); // Agregamos el nuevo hábito a la lista
      })
      .addCase(markHabitDone.fulfilled, (state, action) => {
        const index = state.list.findIndex(h => h._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  }
});

export const { clearHabits } = habitSlice.actions;
export default habitSlice.reducer;