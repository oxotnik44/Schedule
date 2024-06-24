import axios from "axios";
import { setSessionGrades } from "../redux/slices/AccountSlices/SemesterGradesInfoSlice";
import { deleteAccessToken } from "../Storage/AuthTokenStorage";
import { setProfileInfo } from "../redux/slices/AccountSlices/ProfileInfoSlice";
import {
  setBooksList,
  setLibraryStatus,
} from "../redux/slices/AccountSlices/LibraryInfoSlice";
interface BookState {
  bookCover: string | null;
  bookTitle: string;
  dataReturn: string;
  url: string;
}
export const getSemesterGrades = async (
  dispatch: Function,
  navigation: any,
  accessToken: string,
  login: string,
  creditBook: string
) => {
  try {
    if (creditBook !== undefined) {
      const response = await axios.post(
        "https://schedulemobilebackend.nspu.ru:3000/getSemesterGrades",
        { login, credit_book: creditBook },
        { headers: { Authorization: accessToken } }
      );
      const data = response.data !== "" ? transformData(response.data) : null;
      dispatch(setSessionGrades(data));
    }
    navigation.navigate("RecordBookModulesStudent");
  } catch (error) {
    console.error("Ошибка получения оценок за семестр:", error);
  }
};
export const getLibraryBooks = async (
  dispatch: Function,
  accessToken: string,
  navigation: any,
  login: any
) => {
  try {
    const response = await axios.post(
      "https://schedulemobilebackend.nspu.ru:3000/getLibraryBooks",
      { login: login },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const status = response.status;
    const data = response.data;

    if (status === 200 && data.books) {
      const booksList: BookState[] = data.books.map((book: any) => ({
        bookCover: book.big_thumb,
        bookTitle: book.card_short,
        dataReturn: book.return_at,
        url: book.url,
      }));
      dispatch(setBooksList(booksList));
      navigation.navigate("Library");
    } else if (status === 204) {
      dispatch(setBooksList([]));
      dispatch(setLibraryStatus(204));
      navigation.navigate("Library");

      console.log("No books found for the given login");
    } else if (status === 404) {
      dispatch(setLibraryStatus(404));
      navigation.navigate("Library");
    }
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || "Unknown error";

      if (status >= 500 && status < 600) {
        dispatch(setLibraryStatus(status));
        navigation.navigate("Library");
      } else if (status === 404) {
        dispatch(setLibraryStatus(404));
        navigation.navigate("Library");
      } else {
        console.error("Error response:", errorMessage);
      }
    } else {
      console.error("Error during request:", error.message);
    }
  }
};
export const getCreditBookStudent = async (
  accessToken: string,
  dispatch: Function,
  login: string
) => {
  try {
    const response = await axios.post(
      "https://schedulemobilebackend.nspu.ru:3000/getCreditBookStudent",
      { login },
      { headers: { Authorization: accessToken } }
    );

    const data = response.data.data[0];
    const dataStudent = {
      faculty: data.institute,
      formEducation: data.eduform,
      studyDirection: data.direction,
      profileLearning: data.prof,
      yearEntry: data.entrance_date,
    };
    return dataStudent;
    // dispatch(setProfileInfo(dataStudent));
  } catch (error) {
    console.error("Ошибка получения зачетки:", error);
  }
};
const transformData = (data: any) => {
  return data.map((course: any) => ({
    numberCourse: course["НомерКурса"],
    nameCourse: course["Наименование"],
    semesters: course["ПериодыКонтроля"].map((semester: any) => ({
      nameSemester: semester["Наименование"],
      numberSemester: semester["НомерПериодаКонтроля"],
      typeComponent: semester["Компонент"].map((component: any) => ({
        nameControl: component["Наименование"],
        typeControl: component["ВидыКонктроля"].map((typeControl: any) => ({
          nameTypeControl: typeControl["Наименование"],
          disciplines: typeControl["Дисциплины"].map((discipline: any) => ({
            nameDiscipline: discipline["Наименование"],
            codeDiscipline: discipline["УИД_Дисциплины"],
            grade: discipline["Оценка"],
            listCompetencies: discipline["СписокКомпетенций"].map(
              (competencies: any) => ({
                competencyCode: competencies["КодКомпетенции"],
                competencyName: competencies["НаименованиеКомпетенции"],
              })
            ),
          })),
        })),
      })),
    })),
  }));
};
export const logoutUser = async (dispatch: Function, navigation: any) => {
  try {
    deleteAccessToken(dispatch);
    navigation.navigate("Account");
  } catch (error) {
    console.log("Не удалось выйти из аккаунта" + error.message);
  }
};
