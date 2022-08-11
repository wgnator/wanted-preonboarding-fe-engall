import { useAppDispatch } from "../hooks/reduxHooks";
import { loggedIn } from "../reducers/loginReducer";
import http from "../services/users";
import { UserDataType } from "../types/types";

export const useUsersDBModel = () => {
  const dispatch = useAppDispatch();

  const getUserById = (userID: string) => {
    return http.get(`?id=${userID}`);
  };

  const saveUser = (data: UserDataType) => {
    return http.post("", data);
  };

  const deleteUser = (id: number) => {
    return http.delete(id.toString());
  };

  const verifyUser = (id: string | null, password: string | null) => {
    if (id !== null && password !== null)
      getUserById(id).then((response) => {
        console.log(response.data);
        if (response.data[0].pw === password) {
          dispatch(loggedIn(id));
        }
      });
    else alert("please enter valid ID and password");
  };

  return { saveUser, deleteUser, verifyUser };
};
