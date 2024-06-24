import { createSlice } from "@reduxjs/toolkit";

interface BookState {
  bookCover: string | null;
  bookTitle: string;
  dataReturn: string;
  url: string;
}

interface LibraryState {
  dateLibrary: {
    booksList: BookState[];
    status: number | null; // Добавляем статус
  };
}

export const initialLibraryState: LibraryState = {
  dateLibrary: {
    booksList: [],
    status: null, // Инициализируем статус
  },
};

export const LibraryInfoSlice = createSlice({
  name: "Library",
  initialState: initialLibraryState,
  reducers: {
    setBooksList: (state, action) => {
      state.dateLibrary.booksList = action.payload;
    },
    setLibraryStatus: (state, action) => {
      state.dateLibrary.status = action.payload;
    },
  },
});

export const { setBooksList, setLibraryStatus } = LibraryInfoSlice.actions;
export default LibraryInfoSlice.reducer;
