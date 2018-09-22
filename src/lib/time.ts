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
        ...range(0, 60 - INCREMENT_MINS, INCREMENT_MINS).map(min => ({ hour, min })),
    ]), [])
}

function cellDifference(start : Time, end : Time) {
    return ((end.hour - start.hour) * 60 / INCREMENT_MINS) + ((end.min - start.min) / INCREMENT_MINS)
}

export function getTimeOverlayPx({ startTime, endTime } : ScheduledTask) {
    const startPx = cellDifference({ hour: START_TIME, min: 0 }, startTime) * SCHEDULE_CELL_WIDTH_PX

    const widthPx = cellDifference(startTime, endTime) * SCHEDULE_CELL_WIDTH_PX

    return {
        startPx,
        widthPx,
    }
}

export function getEndTimeOptions(start : Time) : Time[] {
    return range(start.hour, END_TIME).reduce((acc, hour) => {
        if (hour === END_TIME) {
            return [ ...acc, { hour, min: 0 }]
        }

        if (hour === start.hour && start.min === 45) {
            return acc
        }

        if (hour === start.hour) {
            return [
                ...acc,
                ...range(start.min + INCREMENT_MINS, 60 - INCREMENT_MINS, INCREMENT_MINS).map(min => ({ hour, min })),
            ]
        }

        return [
            ...acc,
            ...range(0, 60 - INCREMENT_MINS, INCREMENT_MINS).map(min => ({ hour, min })),
        ]
        }, [])
}

export function renderTime(time : Time) {
    const min = time.min === 0
        ? '00'
        : time.min

    return `${time.hour} : ${min}`
}

export function renderTimeToTime(time : string) {
    const [hour, min] = time.split(':')
        .map((t : string) => parseInt(t.trim(), 10))

    return { hour, min }
}