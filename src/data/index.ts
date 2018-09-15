export type CostMatrix = Record<string, Record<string, number>>

export interface SavedCostMatrix {
    id : number
    name : string
    costMatrix : CostMatrix
}

export enum WorkerTags {
    sales = 'sales',
    engineer = 'engineer',
    ux = 'ux',
    cs = 'cs',
    marketing = 'marketing',
}

export interface Worker {
    id : number
    name : string
    tags : WorkerTags[]
}

export interface Task {
    id : number
    name : string
    qty : number
}

export interface Time {
    hour : number
    min : number
}

export interface ScheduledTask {
    id : string
    taskId : number
    startTime : Time
    endTime : Time
}

export interface Schedule {
    id : number
    name : string
    tasks : ScheduledTask[]
}

export interface SavedMustCannotWorkConstraint {
    workers : number[]
    tasks : number[]
}

export interface SavedConstraints {
    mustWork: SavedMustCannotWorkConstraint[]
    cannotWork : SavedMustCannotWorkConstraint[]
}

const getUrl = (path : string) => `http://localhost:3000${path}`

const fetchData = (path : string, method : string) => async (payload ?: any) => {
    const headers = {
        'Content-Type': 'application/json',
    }

    const options = !payload
        ? { method }
        : {
            method,
            body: JSON.stringify(payload)
        }

    const resp = await fetch(getUrl(path), { ...options, headers })

    if (resp.status === 200 || resp.status === 201) {
        return resp.json()
    }
}

export const getWorkers = fetchData('/workers', 'GET')
export const getTasks = fetchData('/tasks', 'GET')
export const getSchedules = fetchData('/schedules', 'GET')

export const saveSchedule = fetchData('/schedules', 'POST')
export const updateSchedule = (id : number) => fetchData(`/schedules/${id}`, 'PUT')

export const saveCostMatrix = fetchData('/costMatrix', 'POST')
export const getCostMatrix = fetchData('/costMatrix', 'GET')
export const updateCostMatrix = (id : number) => fetchData(`/costMatrix/${id}`, 'PUT')

export const getConstraints = fetchData('/constraints', 'GET')
export const saveConstraints = fetchData('./constraints', 'POST')