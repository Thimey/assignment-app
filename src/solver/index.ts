import { Worker, Task, ScheduledTask, CostMatrix, Time } from '../data'
import { SolveOption } from '../stores/allocationSolutionStore'

export interface ScheduledTaskForSolver extends Pick<ScheduledTask, 'id' | 'startTime' | 'endTime'> {
    task : Task
}

export type Solution = Record<string, number[]>

export interface TaskFatigueConstraint {
    workerId : number
    taskId : number
    limit : number
}

export interface TimeUnavailableConstraint {
    workerId : number
    start : Time
    end : Time
}

export interface CannotWorkConstraint {
    workerId : number
    taskId : number
}

export interface MustWorkConstraint {
    workerId : number
    taskId : number
}

export enum ConstraintType {
    sameTask = 'sameTask',
    sameTime = 'sameTime',
    cannotWork = 'cannotWork',
    mustWork = 'mustWork',
    fatigueTotal = 'fatigueTotal',
    fatigueConsecutive = 'fatigueConsecutive',
    unavailable = 'unavailable',
}

export type Constraint = TaskFatigueConstraint |
    TaskFatigueConstraint |
    TimeUnavailableConstraint |
    CannotWorkConstraint |
    MustWorkConstraint

export interface Constraints {
    fatigueTotal: TaskFatigueConstraint[]
    fatigueConsecutive: TaskFatigueConstraint[]
    unavailable : TimeUnavailableConstraint[]
    cannotWork : CannotWorkConstraint[]
    mustWork : MustWorkConstraint[]
}

export interface SolverResponse {
    status : boolean
    solution : Solution | null
    objectiveValue : number | null
}


const SOLVER_URL = 'http://localhost:5000/solve'


export async function solveAllocation(payload : {
    workers : Worker[],
    scheduledTasks : ScheduledTaskForSolver[],
    costMatrix : CostMatrix,
    solverOption : SolveOption,
    timeLimit : number | null,
    constraints ?: Constraints,
}) : Promise<SolverResponse | null> {
    const headers = {
        'Content-Type': 'application/json',
    }

    const resp = await fetch(SOLVER_URL, {
        headers,
        method: 'POST',
        body: JSON.stringify(payload),
     })

    if (resp.status === 200) {
        return resp.json()
    }

    return null
}