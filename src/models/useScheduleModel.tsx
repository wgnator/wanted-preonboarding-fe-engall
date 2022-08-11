import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { CLASS_DURATION } from "../consts/config";
import { useAppSelector } from "../hooks/reduxHooks";
import { SelectedTimeType } from "../pages/AddSchedulePage";
import http from "../services/class-schedule";
import { ScheduleDataType } from "../types/types";
import { convertToInitialTimeZone, convertToMinuteOfWeek, convertToTimeInWeekString, convertToUserTimeZone, DAYS_SEQUENCE, isInDay, normalizeMinuteInWeek } from "../utils/timeCalculations";

type CheckConditionType = Promise<AxiosResponse<ScheduleDataType[] | []>>;

export const useScheduleModel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [data, setData] = useState([] as ScheduleDataType[]);
  const [slotsArray, setSlotsArray] = useState([[]] as ScheduleDataType[][]);
  const userID = useRef(localStorage.getItem("userID"));
  const currentTimeZone = useAppSelector<string>((state) => state.timeZone);

  const loadData = () => {
    if (!userID.current) return;
    setIsLoading(true);
    http
      .get(`?userID=${userID.current}`)
      .then((response) =>
        setData(
          response.data.map((item: ScheduleDataType) => ({
            ...item,
            startTime: convertToUserTimeZone(item.startTime, currentTimeZone),
            endTime: convertToUserTimeZone(item.endTime, currentTimeZone),
          }))
        )
      )
      .catch((error) => alert(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [currentTimeZone]);

  const checkScheduleOverlap = async (data: ScheduleDataType) => {
    const checkCondition1: CheckConditionType = new Promise((resolve) => resolve(http.get(`?startTime_gte=${data.startTime}&startTime_lte=${data.startTime + CLASS_DURATION - 1}`)));
    const checkCondition2: CheckConditionType = new Promise((resolve) => resolve(http.get(`?startTime_gte=${data.endTime - CLASS_DURATION}&startTime_lte=${data.endTime - 1}`)));
    const checkCondition3: CheckConditionType = new Promise((resolve) => resolve(http.get(`?endTime_gte=${data.startTime}&endTime_lte=${data.startTime + CLASS_DURATION - 1}`)));
    const checkCondition4: CheckConditionType = new Promise((resolve) => resolve(http.get(`?endTime_gte=${data.endTime - CLASS_DURATION}&endTime_lte=${data.endTime - 1}`)));
    await Promise.all([checkCondition1, checkCondition2, checkCondition3, checkCondition4]).then((results) => {
      results.forEach((result) => {
        if ("data" in result && result?.data.length)
          throw new Error("schedule_overlap%" + result.data.map((overlappingItem: ScheduleDataType) => convertToTimeInWeekString(overlappingItem.startTime)).join(", "));
      });
    });
  };

  const processAndSaveSchedule = async (time: SelectedTimeType, dayIndexes: number[]) => {
    setIsSaving(true);
    const { hour, minute, AMPM } = time;
    const promises = dayIndexes.map((dayIndex) => {
      const startTimeInMinute = convertToMinuteOfWeek(dayIndex, hour, minute, AMPM);
      return saveSlot({ startTime: startTimeInMinute, endTime: normalizeMinuteInWeek(startTimeInMinute + CLASS_DURATION) });
    });
    await Promise.allSettled(promises);
    setIsSaving(false);
  };

  const saveSlot = async (data: ScheduleDataType) => {
    const timesInInitialTimeZone = { startTime: convertToInitialTimeZone(data.startTime, currentTimeZone), endTime: convertToInitialTimeZone(data.endTime, currentTimeZone) };
    const requestedScheduleInString = `${convertToTimeInWeekString(data.startTime)} - ${convertToTimeInWeekString(data.endTime)}`;

    try {
      await checkScheduleOverlap(timesInInitialTimeZone);
      const _ = await http.post("", { ...timesInInitialTimeZone, userID: userID.current });
      window.alert(`Schedule saved: ${requestedScheduleInString}`);
      return loadData();
    } catch (error) {
      if (error instanceof Error) {
        const overlappingScheduleInString = error.message.split("%")[1];
        window.alert(
          error.message.includes("schedule_overlap")
            ? `Oops! Your entered schedule time "${requestedScheduleInString}" overlaps with saved schedule starting at "${overlappingScheduleInString}" \n`
            : error.message
        );
      }
    }
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

  return { slotsArray, processAndSaveSchedule, deleteSlot, isLoading, isSaving };
};
