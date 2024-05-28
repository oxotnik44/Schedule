import axios from "axios";
import { setSessionGrades } from "../redux/slices/AccountSlices/SemesterGradesInfoSlice";
import { deleteAccessToken } from "../Storage/AuthTokenStorage";
import { setProfileInfo } from "../redux/slices/AccountSlices/ProfileInfoSlice";

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
    console.error("Error while authenticating:", error);
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
    dispatch(setProfileInfo(dataStudent));
  } catch (error) {
    console.error("Error while authenticating:", error);
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
export const logoutUser = async (
  dispatch: Function,
  accessToken: string,
  navigation: any
) => {
  try {
    deleteAccessToken(dispatch, accessToken);
    navigation.navigate("Account");
  } catch (error) {
    console.log("Не удалось выйти из аккаунта" + error.message);
  }
};
