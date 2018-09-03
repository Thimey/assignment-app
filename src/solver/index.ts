import { Worker, Task, ScheduledTask } from '../data'

export interface ScheduledTaskForSolver extends Pick<ScheduledTask, 'id' | 'startTime' | 'endTime'> {
    task : Task
}

export type Solution = Record<string, number[]>

export interface SolverResponse {
    status : boolean
    solution : Solution | null
}

const SOLVER_URL = 'http://localhost:5000/solve'

export async function solveAllocation(
    workers : Worker[],
    scheduledTasks : ScheduledTaskForSolver[],
    costMatrix : Record<string, Record<string, number>>
) : Promise<SolverResponse | null> {
    const headers = {
        'Content-Type': 'application/json',
    }

    const resp = await fetch(SOLVER_URL, {
        headers,
        method: 'POST',
        body: JSON.stringify({
            workers,
            scheduledTasks,
            costMatrix,
        }),
     })

    if (resp.status === 200) {
        return resp.json()
    }

    return null
}