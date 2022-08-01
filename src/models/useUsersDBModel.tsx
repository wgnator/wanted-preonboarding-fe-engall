import { useState } from "react";
import http from "../services/users";
import { UserDataType } from "../types/types";

export const useUsersDBModel = () => {
  const getUser = (userID: string, password: string) => {
    return http.get(`?id=${userID}&pw=${password}`);
  };

  const saveUser = (data: UserDataType) => {
    return http.post("", data);
  };

  const deleteUser = (id: number) => {
    return http.delete(id.toString());
  };

  return { getUser, saveUser, deleteUser };
};
