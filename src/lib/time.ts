import { Time, ScheduledTask } from '../data'
import {
    START_TIME,
    END_TIME,
    INCREMENT_MINS,
    SCHEDULE_CELL_WIDTH_PX,
    // SCHEDULE_HEADER_CELL_HEIGHT_PX,
    // SCHEDULE_CONTENT_CELL_HEIGHT_PX,
} from '../config'

function range(start : number, end : number, increment : number = 1) {
    var i
    const rangeArr : number[] = []
    for (i = start; i <= end; i += increment) {
        rangeArr.push(i)
    }

    return rangeArr
}

export function getTimes() : Time[] {
    return range(START_TIME, END_TIME).reduce((acc, hour) => ([
        ...acc,
        ...range(0, 60, INCREMENT_MINS).map(min => ({ hour, min })),
    ]), [])
}

function cellDifference(start : Time, end : Time) {
    return ((end.hour - start.hour) * 60 / INCREMENT_MINS) + ((end.min - start.min) / INCREMENT_MINS)
}

export function getTimeOverlay({ startTime, endTime } : ScheduledTask) {
    const startPx = cellDifference({ hour: START_TIME, min: 0 }, startTime) * SCHEDULE_CELL_WIDTH_PX

    const widthPx = cellDifference(startTime, endTime) * SCHEDULE_CELL_WIDTH_PX

    return {
        startPx,
        widthPx,
    }
}
