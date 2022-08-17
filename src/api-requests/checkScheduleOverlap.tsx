import { AxiosResponse } from "axios";
import { CLASS_DURATION } from "../consts/config";
import { ScheduleDataType } from "../types/types";
import http from "../services/class-schedule";
import { convertToTimeInWeekString } from "../utils/timeCalculations";

type CheckConditionType = Promise<AxiosResponse<ScheduleDataType[] | []>>;

export default async function checkScheduleOverlap(data: ScheduleDataType) {
  //start time subtracted from end time & end time add from start time are needed to caculate for the situation where the schedule streches over the end of week
  const subtractedStartTime = data.endTime - CLASS_DURATION;
  const addedEndTime = data.startTime + CLASS_DURATION;

  //due to json-server having only gte and lte and no gt or lt, we have to subtract/add 1 to avoid overlap on end time and start time being the same
  const checkCondition1: CheckConditionType = new Promise((resolve) => resolve(http.get(`?startTime_gte=${data.startTime}&startTime_lte=${addedEndTime - 1}`)));
  const checkCondition2: CheckConditionType = new Promise((resolve) => resolve(http.get(`?startTime_gte=${subtractedStartTime}&startTime_lte=${data.endTime - 1}`)));
  const checkCondition3: CheckConditionType = new Promise((resolve) => resolve(http.get(`?endTime_gte=${data.startTime + 1}&endTime_lte=${addedEndTime}`)));
  const checkCondition4: CheckConditionType = new Promise((resolve) => resolve(http.get(`?endTime_gte=${subtractedStartTime + 1}&endTime_lte=${data.endTime}`)));

  await Promise.all([checkCondition1, checkCondition2, checkCondition3, checkCondition4]).then((results) => {
    results.forEach((result) => {
      if ("data" in result && result?.data.length)
        throw new Error("schedule_overlap%" + result.data.map((overlappingItem: ScheduleDataType) => convertToTimeInWeekString(overlappingItem.startTime)).join(", "));
    });
  });
}
