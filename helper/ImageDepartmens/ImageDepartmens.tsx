import React from "react";
import { Dimensions, Image, View } from "react-native";
import { styles } from "./ImageDepartmensStyle";

const screenWidth = Dimensions.get("window").width;

const ImageDepartmens = ({ imgDepartment }: { imgDepartment: string }) => {
  const imageMapping: { [key: string]: any } = {
    "ffk.png": require("../../assets/imageDepartments/ffk.png"),
    "fiya.png": require("../../assets/imageDepartments/fiya.png"),
    "fkido.png": require("../../assets/imageDepartments/fkido.png"),
    "fp.png": require("../../assets/imageDepartments/fp.png"),
    "id.png": require("../../assets/imageDepartments/id.png"),
    "iesen.png": require("../../assets/imageDepartments/iesen.png"),
    "ifmip.png": require("../../assets/imageDepartments/ifmip.png"),
    "ifmito.png": require("../../assets/imageDepartments/ifmito.png"),
    "ii.png": require("../../assets/imageDepartments/ii.png"),
    "iigso.png": require("../../assets/imageDepartments/iigso.png"),
    "irso.png": require("../../assets/imageDepartments/irso.png"),
  };

  return (
    <View style={{ marginLeft: screenWidth * 0.04 }}>
      {imageMapping[imgDepartment] && (
        <Image source={imageMapping[imgDepartment]} style={styles.imgDepartments} />
      )}
    </View>
  );
};

export default ImageDepartmens;
