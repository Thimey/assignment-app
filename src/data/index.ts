export interface Worker {
    id : number
    name : string
    type : 'engineer' | 'sales' | 'cs' | 'ux' | 'marketing' | 'CTO' | 'CEO'
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

export interface Schedule {
    id : number
    tasks : {
        taskId : number
        times : Time[]
    }[]
}

const getUrl = (path : string) => `http://localhost:3000${path}`

const fetchData = (path : string, method : string) => async (payload ?: any) => {
    const options = !payload
        ? { method }
        : {
            method,
            body: JSON.stringify(payload)
        }

    const resp = await fetch(getUrl(path), options)

    if (resp.status === 200) {
        return resp.json()
    }
}

export const getWorkers = fetchData('/workers', 'GET')
export const getTasks = fetchData('/tasks', 'GET')
export const getSchedules = fetchData('/schedules', 'GET')

