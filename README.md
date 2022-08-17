# EngAll Tutor Schedule Management Project

## How to run:

### Run json-server

```bash
> npm run server
```

### Run app

```bash
> npm run dev
```

Connect to http://localhost:5173 on browser

## Main Objectives

- Render UI Components as required in the provided spec
- View Schedule page:
  - Should have a weekly table with available time slots(day columns) without specific dates
  - Each entered time slot is removable with x button
  - Tapping on the Add Class Schedule button directs to Add Schedule page
- Add Schedule page:
  - Class duration is always 40 minutes
  - Start time minutes are limited to 5 minute intervals starting 0
  - Hour of star time range from 0 to 23
  - A user can select multiple weekdays to repeat by choosing days from "Repeat on" section.
  - Clicking Save button should redirect to View Schedule page with an updated schedule table.
  - There should not be any overlapping slots in view class schedule.
  - The class schedule must persist on user refreshing the page.

## Additional Features Implemented

- Time zone selection feature for users connecting from outside South Korea
- Support multiple tutors with a login feature with a user database
- Responsive UI
- Alert for errors such as attempting to make an overalapping slot
- Custom made loading spinner

## Implementation Details:

- For schedule & user database, `json-server` library is used.
- Time information handling: since the time slots in this app only contains time in week rather than an actual timestamp, start time and end time of classes are turned into the nth-minute past from the start of the week for simplicity, rather than storing day & time information. We can benefit from it when it comes to handling each user's different time zone setting, including summer time application for certain countries.
- Avoiding using time related libraries such as date-fns was intentional. The goal was to create calculation methods as much as possible not using outside libraries. However, `date-fns-tz` library is used, only to `getTimezoneOffset` from user's time zone to UTC and UTC from Seoul, Korea, as which the database is set.
- The difficulty of handling time in week without specifying a real timestamp comes in the nature that it has to be 'circular'. For example, if an user puts in a schedule slot starting Sunday 11:40 p.m.(minute in week: 10060), the end of the class must be Monday 00:20 a.m. Now, the simply adding 40 minutes to the start time(minute in week: 10100) will break the data integrity, since there could be an already overlapping slot, say, starting Monday 00:00 a.m.(minute in week: 0), not producing an overlap error because the numbers in data do not overlap.
- To handle this problem, 2 utilities are provided:
  1. Minute in week number normalization - If an end time of a slot goes past, we add the whole week's length of minutes and mod by the whole week's length again. This way, we can handle both situations with this one function: one with when time becoming a negative(caused by shifting to ealier time zone), and secondly when the time goes past the length of week.
  2. Data comparison for overlap check - This is a bit complex, we have to parellel and cross check the start time and end time caculated from both ends, from both side. This is because unlike the regular overlap check which there are only two cases--start time being in between existing slot's start and end data and end time being in between--the 'crossing over' slot is split in two(one in Sunday night and another in Monday morning), which doubles the checking process.
- Time zone handling: User's initial time zone information is stored in Redux store, using ECMAScript Internationalization API's `Intl.DataTimeFormat()`. Also, the list of time zone is derived from this API. `date-fns-tz`'s `getTimezoneOffset` automatically inserts new Date object as the second argument at the moment of call, to determine whether to calculate for summertime difference, if the region received as first argument is relevant to it.

## Features To Be Added/Improved:

- Sign up feature
- ~~Make alerts to be more UI friendly~~
