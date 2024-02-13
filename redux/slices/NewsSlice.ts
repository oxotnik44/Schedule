import { createSlice } from "@reduxjs/toolkit";

interface INewsItem {
  title: string;
  textNews: string;
  photoNews: string;
  publicationDate: string;
}

interface IState {
  newsData: INewsItem[];
}

export const initialNewsState: IState = {
  newsData: [],
};
export const NewsInfoSlice = createSlice({
  name: "News",
  initialState: initialNewsState,
  reducers: {
    setNewsData: (state, action) => {
      state.newsData = action.payload;
    },
    resetNews: (state) => {
      state.newsData = [];
    },
  },
});

export const { setNewsData, resetNews } = NewsInfoSlice.actions;

export default NewsInfoSlice.reducer;
