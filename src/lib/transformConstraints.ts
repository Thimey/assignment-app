// import { SavedMustCannotWorkConstraint } from '../data'
import { isEmpty, uniq } from 'ramda'


export interface WorkerTaskGroup {
    workers : number[]
    tasks ?: number[]
    [other : string] : any
}

function flattenGroup({
    workers,
    tasks,
    ...data
} : WorkerTaskGroup) {

    const hasWorkers = workers.length > 0
    const hasTasks = tasks && tasks.length > 0

    if (!hasWorkers) {
        return []
    }

    return workers.reduce((acc, workerId) => {
        if (!hasTasks) {
            return [...acc, { workerId, ...data }]
        }

        return [
            ...acc,
            ...tasks!.reduce((acc2, taskId) => ([
                ...acc2,
                {
                    workerId,
                    taskId,
                    ...data,
                }
            ]), []),
        ]
    }, [])
}

export function flattenConstraints(groups : WorkerTaskGroup[]) {
    const flattenedGroup = groups.reduce((acc, group) => ([
        ...acc,
        ...flattenGroup(group),
    ]), [])

    return flattenedGroup
}

export function transformMustCannotAtLeastConstraints(groups : WorkerTaskGroup[]) {
    const constraintsObj = {}

    groups.forEach(({workers, tasks, ...other }) => {
        const hasTasks = !!tasks && tasks.length > 0
        const data = isEmpty(other) ? true : other

        workers.forEach(workerId => {
            if (hasTasks) {
                tasks!.forEach(taskId => {
                    if (constraintsObj[workerId]) {
                        constraintsObj[workerId][taskId] = data
                    } else {
                        constraintsObj[workerId] = { [taskId]: data }
                    }
                })
            } else {
                constraintsObj[workerId] = data
            }
        })
    })

    return constraintsObj
}

export function transformTimeFatigueTotalConstraints(groups : WorkerTaskGroup[]) {
    const constraintsObj = {}

    groups.forEach(({workers, ...other }) => {
        workers.forEach(workerId => {
            if (constraintsObj[workerId]) {
                constraintsObj[workerId] = [
                    ...constraintsObj[workerId],
                    {
                        ...other,
                    }
                ]
            } else {
                constraintsObj[workerId] = [
                    {
                        ...other
                    }
                ]
            }
        })
    })

    return constraintsObj
}

export function transformOverallTimeFatigueTotalConstraints(groups : WorkerTaskGroup[]) {
    const constraintsObj = {}

    groups.forEach(({workers, limit }) => {
        workers.forEach(workerId => {
            constraintsObj[workerId] = { limit }
        })
    })

    return constraintsObj
}

export function transformConsecutiveFatigueConstraints(groups : WorkerTaskGroup[]) {
    const constraintsObj = {}

    groups.forEach(({workers, limit }) => {
        if (constraintsObj[limit]) {
            constraintsObj[limit] = uniq([constraintsObj[limit], ...workers])
        } else {
            constraintsObj[limit] = workers
        }
    })

    return constraintsObj
}