import axios from "axios";
import { setSessionGrades } from "../redux/slices/SemesterGradesInfoSlice";

export const getSemesterGrades = async (
  dispatch: Function,
  navigation: any
) => {
  try {
    const response = await axios.post(
      "https://schedulemobilebackend.nspu.ru:3000/getSemesterGrades",
      {
        login: "073091210723",
        credit_book: "972199",
      }
    );

    const data = response.data.map((course: any) => ({
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
    // Вызываем действие setCourses и передаем ему преобразованные данные
    dispatch(setSessionGrades(data));
    navigation.navigate("RecordBookModulesStudent");
  } catch (error) {
    console.error("Error while authenticating:", error);
  }
};
