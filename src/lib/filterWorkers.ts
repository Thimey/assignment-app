import { any } from 'ramda'

import { Worker } from '../data'

export function filterWorkers(workers : Worker[], filter : string, ) {
    const filters = filter === ''
        ? [filter]
        : filter
            .split(',')
            .map(f => f.trim())
            .filter(f => !!f)

    return workers
        .filter(worker =>
            any(f => worker.name.includes(f), filters) ||
            any(tag =>
                any(f => tag.includes(f)
                , filters)
            , worker.tags)
        )
}

export default filterWorkers
