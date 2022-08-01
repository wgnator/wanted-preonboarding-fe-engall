import { useEffect, useRef, useState } from "react";
import { CLASS_DURATION } from "../consts/config";
import http from "../services/class-schedule";
import { ScheduleDataType } from "../types/types";
import { convertToTimeInWeekString, DAYS_SEQUENCE, isInDay, MINUTES_IN_HOUR, MINUTES_IN_WEEK } from "../utils/timeCalculations";

export const useScheduleModel = () => {
  const [data, setData] = useState([] as ScheduleDataType[]);
  const [slotsArray, setSlotsArray] = useState([[]] as ScheduleDataType[][]);
  const userID = useRef(localStorage.getItem("userID"));

  const loadData = () => {
    if (!userID.current) return;
    http
      .get(`?userID=${userID.current}`)
      .then((response) => setData(response.data))
      .catch((error) => alert(error));
  };

  const checkScheduleOverlap = async (data: ScheduleDataType) => {
    return await http.get(`?startTime_gte=${data.startTime - CLASS_DURATION - 1}&startTime_lte=${data.endTime - 1}`).then((response) => {
      if (response.data.length) throw new Error("schedule_overlap%" + response.data.map((overlappingItem: ScheduleDataType) => convertToTimeInWeekString(overlappingItem.startTime)).join(", "));
    });
  };

  const saveSlot = async (data: ScheduleDataType) => {
    if (data.endTime > MINUTES_IN_WEEK) data.endTime -= MINUTES_IN_WEEK;
    return await checkScheduleOverlap(data).then((_) => http.post("", { ...data, userID: userID.current }).then((_) => loadData()));
  };

  const deleteSlot = (id: number) => {
    if (!id) return;
    http
      .delete(id.toString())
      .then((_) => loadData())
      .catch((error) => alert(error));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSlotsArray(Object.keys(DAYS_SEQUENCE).map((day) => data.filter((_data) => isInDay(_data.startTime, day as keyof typeof DAYS_SEQUENCE)).sort((a, b) => a.startTime - b.startTime)));
  }, [data]);

  return { slotsArray, saveSlot, deleteSlot };
};
