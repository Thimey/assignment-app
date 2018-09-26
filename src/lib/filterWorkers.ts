import { any } from 'ramda'

import { Worker } from '../data'

import splitFilter from './splitFilter'

export function filterWorkers(workers : Worker[], filter : string, ) {
    const filters = splitFilter(filter)

    return workers
        .filter(filterWorker(filters))
}

export const filterWorker = (filters : string[] | string) => (worker : Worker) => {
    const filterArr = Array.isArray(filters)
        ? filters
        : splitFilter(filters)

    return any(f => worker.name.toLowerCase().includes(f), filterArr) ||
        any(tag =>
            any(f => tag.toLowerCase().includes(f)
            , filterArr)
        , worker.tags)
}

export default filterWorkers
