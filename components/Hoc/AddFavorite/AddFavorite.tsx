import React, { useCallback, memo } from "react";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SelectGroup } from "./AddFavoriteStyle";
import { handleAddFavoriteGroup } from "../../../redux/reducers/favoritesReducer/favoriteGroupsReducer";
import { ThemeProvider } from "styled-components/native";
import { handleAddFavoriteEduactor } from "../../../redux/reducers/favoritesReducer/favoriteEducatorsReducer";
const screenWidth = Dimensions.get("window").width;

interface FavoriteGroupsState {
  favoriteGroupReducer: {
    favoriteGroups: { idGroup: number; nameGroup: string }[];
  };
}
interface FavoriteEducatorsState {
  favoriteEducatorReducer: {
    favoriteEducators: { idEducator: number; nameEducator: string }[];
  };
}
type ITheme = {
  settingsReducer: {
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
    (state: FavoriteGroupsState) => state.favoriteGroupReducer.favoriteGroups
  );
  const favoriteEducators = useSelector(
    (state: FavoriteEducatorsState) =>
      state.favoriteEducatorReducer.favoriteEducators
  );
  const dispatch = useDispatch();
  const theme = useSelector((state: ITheme) => state.settingsReducer.theme);

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
      ? require("../../../assets/HeartFull.png")
      : require("../../../assets/Heart.png")
    : favoriteEducators.some(
        (educatorFavorite) => educatorFavorite.idEducator === idEducator
      )
    ? require("../../../assets/HeartFull.png")
    : require("../../../assets/Heart.png");

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
