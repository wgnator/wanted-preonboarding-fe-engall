import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../hooks/reduxHooks";
import http from "../services/class-schedule";
import { ScheduleDataType } from "../types/types";
import { convertToInitialTimeZone, convertToTimeInWeekString, convertToUserTimeZone, DAYS_SEQUENCE, isInDay } from "../utils/timeCalculations";
import checkScheduleOverlap from "./checkScheduleOverlap";

export const useScheduleDB = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState([] as ScheduleDataType[]);
  const [slotsArray, setSlotsArray] = useState([[]] as ScheduleDataType[][]);
  const userID = useRef(localStorage.getItem("userID"));
  const currentTimeZone = useAppSelector<string>((state) => state.timeZone);

  const requestWithStatus = async (request: () => Promise<void | AxiosResponse>, reload: boolean) => {
    setIsLoading(true);
    await request();
    if (reload) await loadSlots();
    setIsLoading(false);
  };

  const loadSlots = () => {
    if (!userID.current)
      return new Promise(() => {
        throw new Error("Oops! You seemed to be signed out. Please sign in.");
      });

    return requestWithStatus(
      () =>
        http.get(`?userID=${userID.current}`).then((response) =>
          setData(
            response.data.map((item: ScheduleDataType) => ({
              ...item,
              startTime: convertToUserTimeZone(item.startTime, currentTimeZone),
              endTime: convertToUserTimeZone(item.endTime, currentTimeZone),
            }))
          )
        ),
      false
    );
  };

  useEffect(() => {
    loadSlots();
  }, [currentTimeZone]);

  const saveSlots = async (slots: ScheduleDataType[]) => {
    const resultsOnSave = { succeededSlots: [] as string[], failedSlots: [] as string[] };
    const promises = slots.map((slot) => saveSlot(slot));

    await requestWithStatus(async () => {
      const results = await Promise.allSettled(promises);
      console.log(results);
      results.forEach((promiseResult) => (promiseResult.status === "fulfilled" ? resultsOnSave.succeededSlots.push(promiseResult.value || "") : resultsOnSave.failedSlots.push(promiseResult.reason)));
    }, true);
    return (
      (resultsOnSave.succeededSlots.length > 0 ? `Schedule successfully saved: \n ${resultsOnSave.succeededSlots.join("\n")} \n` : "") +
      (resultsOnSave.failedSlots.length > 0 ? `Schedule failed to save: \n` + resultsOnSave.failedSlots.join("\n") : "")
    );
  };

  const saveSlot = async (slot: ScheduleDataType) => {
    const timesInInitialTimeZone = { startTime: convertToInitialTimeZone(slot.startTime, currentTimeZone), endTime: convertToInitialTimeZone(slot.endTime, currentTimeZone) };
    const requestedScheduleInString = `${convertToTimeInWeekString(slot.startTime)} - ${convertToTimeInWeekString(slot.endTime)}`;

    try {
      await checkScheduleOverlap(timesInInitialTimeZone);
      await http.post("", { ...timesInInitialTimeZone, userID: userID.current });
      return requestedScheduleInString;
    } catch (error) {
      if (error instanceof Error) {
        const overlappingScheduleInString = error.message.split("%")[1];
        throw new Error(
          error.message.includes("schedule_overlap") ? ` "${requestedScheduleInString}" overlaps with the existing schedule starting at "${overlappingScheduleInString}" \n` : error.message
        );
      }
    }
  };

  const deleteSlot = (id: number) => {
    if (!id)
      return new Promise(() => {
        throw new Error("Error: Cannot find requested slot id");
      });
    return requestWithStatus(() => http.delete(id.toString()), true);
  };

  useEffect(() => {
    loadSlots();
  }, []);

  useEffect(() => {
    setSlotsArray(Object.keys(DAYS_SEQUENCE).map((day) => data.filter((_data) => isInDay(_data.startTime, day as keyof typeof DAYS_SEQUENCE)).sort((a, b) => a.startTime - b.startTime)));
  }, [data]);

  return { slotsArray, saveSlots, deleteSlot, isLoading };
};
