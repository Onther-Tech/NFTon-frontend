import {useCallback, useEffect, useState} from "react";
import {cancelFavoriteOrder, favoriteOrder} from "../reducers/order";
import {fetchFavoriteOrders, userState} from "../reducers/user";
import {useDispatch, useSelector} from "react-redux";

const useOrderFavorite = (idorders, postAction) => {
  const dispatch = useDispatch();
  const {idprofiles, favorites} = useSelector(userState);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    setFavoriteId(favorites.find(x => x.idorders === idorders)?.idFavoriteOrders);
  }, [idorders, favorites]);

  const onClickFavorite = useCallback((e) => {
    e.preventDefault();

    if (idorders) {
      (async () => {
        if (favoriteId) {
          await dispatch(cancelFavoriteOrder({idfavoriteOrders: favoriteId}));
        } else {
          await dispatch(favoriteOrder({idorders}));
        }

        dispatch(fetchFavoriteOrders({idprofiles}))
        postAction && postAction();
      })();
    }
  }, [idprofiles, idorders, favoriteId, postAction]);

  return {
    isFavoriteOrder: Boolean(favoriteId),
    onClickFavorite
  }
};

export default useOrderFavorite;
