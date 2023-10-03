import React from "react";
import { Dimensions, Image, View } from "react-native";
import { styles } from "./ImageDepartmensStyle";
const screenWidth = Dimensions.get("window").width;

const ImageDepartmens = ({ imgDepartment }: { imgDepartment: string }) => {
  return (
    <View style={{ marginLeft: screenWidth * 0.04 }}>
      {imgDepartment === "ffk.png" && (
        <Image
          source={require("../../../assets/imageDepartments/ffk.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "fiya.png" && (
        <Image
          source={require("../../../assets/imageDepartments/fiya.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "fkido.png" && (
        <Image
          source={require("../../../assets/imageDepartments/fkido.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "fp.png" && (
        <Image
          source={require("../../../assets/imageDepartments/fp.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "id.png" && (
        <Image
          source={require("../../../assets/imageDepartments/id.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "iesen.png" && (
        <Image
          source={require("../../../assets/imageDepartments/iesen.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "ifmip.png" && (
        <Image
          source={require("../../../assets/imageDepartments/ifmip.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "ifmito.png" && (
        <Image
          source={require("../../../assets/imageDepartments/ifmito.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "ii.png" && (
        <Image
          source={require("../../../assets/imageDepartments/ii.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "iigso.png" && (
        <Image
          source={require("../../../assets/imageDepartments/iigso.png")}
          style={styles.imgDepartments}
        />
      )}
      {imgDepartment === "irso.png" && (
        <Image
          source={require("../../../assets/imageDepartments/irso.png")}
          style={styles.imgDepartments}
        />
      )}
    </View>
  );
};

export default ImageDepartmens;
