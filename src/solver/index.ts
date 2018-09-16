import { Worker, Task, ScheduledTask, CostMatrix, Time } from '../data'
import { SolveOption } from '../stores/allocationSolutionStore'

export interface ScheduledTaskForSolver extends Pick<ScheduledTask, 'id' | 'startTime' | 'endTime'> {
    task : Task
}

export type Solution = Record<string, number[]>

export interface WorkerOnlyConstraint<T> {
    [workerId : string] : T
}

export interface WorkerTaskConstraint<T> {
    [workerId : string] : {
        [taskId : string] : boolean
    }
}

export type MustWorkConstraint = WorkerTaskConstraint<boolean>
export type CannotWorkConstraint = WorkerTaskConstraint<boolean>
export type AtLeastWorkConstraint = WorkerTaskConstraint<boolean>

export type TimeFatigueConstraint = WorkerOnlyConstraint<{
    taskIds : number[]
    limit : number
}>

export type TimeUnavailableConstraint = WorkerOnlyConstraint<{
    start : Time
    end : Time
}>

export enum ConstraintType {
    sameTask = 'sameTask',
    sameTime = 'sameTime',
    cannotWork = 'cannotWork',
    mustWork = 'mustWork',
    atLeastWork = 'atLeastWork',
    timeFatigueTotal = 'timeFatigueTotal',
    timeFatigueConsecutive = 'timeFatigueConsecutive',
    unavailable = 'unavailable',
    fifa = 'fifa'
}

export type Constraint =
    TimeFatigueConstraint |
    TimeUnavailableConstraint |
    CannotWorkConstraint |
    MustWorkConstraint |
    AtLeastWorkConstraint

export interface Constraints {
    timeFatigueTotal ?: TimeFatigueConstraint[]
    timeFatigueConsecutive ?: TimeFatigueConstraint[]
    unavailable ?: TimeUnavailableConstraint[]
    cannotWork ?: CannotWorkConstraint[]
    mustWork ?: MustWorkConstraint[]
    atLeastWork ?: AtLeastWorkConstraint[]
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