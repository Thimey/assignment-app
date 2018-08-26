import { Time } from '../data'

function range(_start : number, _end : number) {
    // const r = []
    // for (i)
    // return [...Array(end - start).keys() as any].map(i => i + start)

    return [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
}

export default function getTimes(start : number, end : number) : Time[] {
    return range(start, end).reduce((acc, hour) => ([
        ...acc,
        ...[0, 15, 30, 45].map(min => ({ hour, min })),
    ]), [])
}