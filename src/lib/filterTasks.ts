import { any } from 'ramda'

import { Task } from '../data'

import splitFilter from './splitFilter'


export function filterTasks(tasks : Task[], filter : string, ) {
    const filters = splitFilter(filter)

    return tasks
        .filter(filterTask(filters))
}

export const filterTask = (filters : string[] | string) => (task : Task) => {
    const filterArr = Array.isArray(filters)
        ? filters
        : splitFilter(filters)

    return any(f => task.name.toLowerCase().includes(f), filterArr)
}

export default filterTasks
