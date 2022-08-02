import { AxiosResponse } from "axios";
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
    const checkCondition1 = new Promise((resolve, _) => resolve(http.get(`?startTime_gte=${data.startTime}&startTime_lte=${data.startTime + CLASS_DURATION - 1}`)));
    const checkCondition2 = new Promise((resolve, _) => resolve(http.get(`?startTime_gte=${data.endTime - CLASS_DURATION}&startTime_lte=${data.endTime - 1}`)));
    const checkCondition3 = new Promise((resolve, _) => resolve(http.get(`?endTime_gte=${data.startTime}&endTime_lte=${data.startTime + CLASS_DURATION - 1}`)));
    const checkCondition4 = new Promise((resolve, _) => resolve(http.get(`?endTime_gte=${data.endTime - CLASS_DURATION}&endTime_lte=${data.endTime - 1}`)));
    await Promise.all([checkCondition1, checkCondition2, checkCondition3, checkCondition4]).then((results) => {
      results.forEach((result) => {
        if (typeof result === "object" && result?.data.length)
          throw new Error("schedule_overlap%" + result.data.map((overlappingItem: ScheduleDataType) => convertToTimeInWeekString(overlappingItem.startTime)).join(", "));
      });
    });
  };

  const saveSlot = async (data: ScheduleDataType) => {
    if (data.endTime > MINUTES_IN_WEEK) data.endTime -= MINUTES_IN_WEEK;
    return await checkScheduleOverlap(data).then(() => http.post("", { ...data, userID: userID.current }).then(() => loadData()));
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
