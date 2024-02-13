import React from "react";
import { Dimensions,  TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components/native";
import { handleAddFavoriteGroup } from "../../redux/slices/FavoritesSlice/FavoriteGroupsSlice";
import { handleAddFavoriteEduactor } from "../../redux/slices/FavoritesSlice/FavoriteEducatorsSlice";
import { SelectGroup } from "./AddFavoriteStyle";
const screenWidth = Dimensions.get("window").width;

interface FavoriteGroupsState {
  FavoriteGroupsSlice: {
    favoriteGroups: { idGroup: number; nameGroup: string }[];
  };
}
interface FavoriteEducatorsState {
  FavoriteEducatorsSlice: {
    favoriteEducators: { idEducator: number; nameEducator: string }[];
  };
}
type ITheme = {
  SettingsSlice: {
    theme: any;
  };
};
const AddFavorite = ({
  idGroup,
  nameGroup,
  idEducator,
  nameEducator,
}: {
  idGroup: number | any;
  nameGroup: string | any;
  idEducator: number | any;
  nameEducator: string | any;
}) => {
  const favoriteGroups = useSelector(
    (state: FavoriteGroupsState) => state.FavoriteGroupsSlice.favoriteGroups
  );
  const favoriteEducators = useSelector(
    (state: FavoriteEducatorsState) =>
      state.FavoriteEducatorsSlice.favoriteEducators
  );
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.SettingsSlice.theme);

  const isGroup = nameGroup !== null ? true : false;

  const handlePress = () => {
    if (isGroup) {
      const isFavoriteGroup = favoriteGroups.some(
        (groupFavorite) => groupFavorite.idGroup === idGroup
      );
      handleAddFavoriteGroup(isFavoriteGroup, idGroup, nameGroup, dispatch);
    } else {
      const isFavoriteEducator = favoriteEducators.some(
        (educatorFavorite) => educatorFavorite.idEducator === idEducator
      );
      handleAddFavoriteEduactor(
        isFavoriteEducator,
        idEducator,
        nameEducator,
        dispatch
      );
    }
  };

  const source = isGroup
    ? favoriteGroups.some((groupFavorite) => groupFavorite.idGroup === idGroup)
      ? require("../../assets/HeartFull.png")
      : require("../../assets/Heart.png")
    : favoriteEducators.some(
        (educatorFavorite) => educatorFavorite.idEducator === idEducator
      )
    ? require("../../assets/HeartFull.png")
    : require("../../assets/Heart.png");

  return (
    <ThemeProvider theme={theme}>
      <TouchableOpacity
        style={{ paddingHorizontal: screenWidth * 0.07 }}
        onPress={handlePress}
      >
        <SelectGroup source={source} style={{ resizeMode: "contain" }} />
      </TouchableOpacity>
    </ThemeProvider>
  );
};

export default AddFavorite;
