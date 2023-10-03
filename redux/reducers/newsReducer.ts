import { Reducer } from "redux";

const SET_NEWS_DATA = "SET_NEWS_DATA";
const RESET_NEWS = "RESET_NEWS";

interface INewsItem {
  title: string;
  textNews: string;
  photoNews: string
  publicationDate: string;
}

interface IState {
  newsData: INewsItem[];
}

export const initialNewsState: IState = {
  newsData: [],
};

const newsReducer: Reducer<IState> = (state = initialNewsState, action) => {
  switch (action.type) {
    case SET_NEWS_DATA:
      return {
        ...state,
        newsData: [...state.newsData, ...action.newsData],
      };

    case RESET_NEWS:
      return {
        ...state,
        newsData: [],
      };

    default:
      return state;
  }
};

export const setNewsData = (data: any) => ({
  type: SET_NEWS_DATA,
  newsData: data,
});

export const resetNews = () => ({
  type: RESET_NEWS,
});

export default newsReducer;
