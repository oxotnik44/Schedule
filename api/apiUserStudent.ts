import axios from "axios";
import { setCourses } from "../redux/slices/aSlice";

export const getSemesterGrades = async (dispatch: Function) => {
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
              appraisal: discipline["Оценка"],
              listCompetencies: discipline["СписокКомпетенций"].map(
                (competencies: any) => ({
                  codeCompetencies: competencies["КодКомпетенции"],
                  nameCompetencies: competencies["НаименованиеКомпетенции"],
                })
              ),
            })),
          })),
        })),
      })),
    }));

    // Вызываем действие setCourses и передаем ему преобразованные данные
    dispatch(setCourses(data));
  } catch (error) {
    console.error("Error while authenticating:", error);
  }
};
