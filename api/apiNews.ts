import axios from "axios";
import { setNewsData } from "../redux/reducers/newsReducer";
import he from "he";
import moment from "moment";
import "moment/locale/ru";
var parseString = require("react-native-xml2js").parseString;
var striptags = require("striptags");
interface NewsItem {
  title: string;
  link: string;
  textNews: string;
  publicationDate: string;
  photoNews: string;
}

export const getNews = async (dispatch: Function) => {
  try {
    const response = await axios.get<string>(
      "https://nspu.ru/rss/news-rss.php"
    );
    const xmlData: string = response.data;
    parseString(xmlData, (err: any, result: any) => {
      if (err) {
        console.log("Error parsing xml", err);
        return;
      }
      const newsItems: any[] = result.rss.channel[0].item;
      const parsedNews: NewsItem[] = newsItems.map((item: any) => {
        const formattedDate = moment(item.pubDate[0]).format("D MMMM");
        return {
          title: he.decode(item.title[0]), // Декодировать заголовок
          link: item.link[0],
          textNews: striptags(he.decode(item.description[0])), // Декодировать текст новости
          publicationDate: formattedDate,
          photoNews: item.enclosure[0].$.url,
        };
      });
      dispatch(setNewsData(parsedNews));
    });
  } catch (e) {
    console.log(e);
  }
};
