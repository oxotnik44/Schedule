import { createSlice } from "@reduxjs/toolkit";
interface BooksState {
  idBook: number;
  dateReceipt: string | null;
  nameBook: string;
}
interface LibraryState {
  dateLibrary: {
    cardLibrary: string | null;
    booksList: BooksState[];
  };
}

export const initialLibraryState: LibraryState = {
  dateLibrary: {
    cardLibrary: null,
    booksList: [],
  },
};
export const LibraryInfoSlice = createSlice({
  name: "Library",
  initialState: initialLibraryState,
  reducers: {
    setCardLibrary: (state, action) => {
      state.dateLibrary.cardLibrary = action.payload;
    },
    setBooksList: (state, action) => {
      state.dateLibrary.booksList = action.payload;
    },
  },
});

export const { setCardLibrary, setBooksList } = LibraryInfoSlice.actions;
export default LibraryInfoSlice.reducer;
