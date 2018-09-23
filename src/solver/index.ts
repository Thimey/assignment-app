import { Worker, Task, ScheduledTask, CostMatrix, Time } from '../data'
import { SolveOption } from '../stores/allocationSolutionStore'

export interface ScheduledTaskForSolver extends Pick<ScheduledTask, 'id' | 'startTime' | 'endTime'> {
    task : Task
}

export interface SolutionByTask {
    [scheduleTaskId : string] : number[] // workerIds
}

export interface SolutionByWorker {
    [workerId : string] : string[] // workerIds
}

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
export type OverallTimeFatigueTotalConstraint = WorkerOnlyConstraint<number>

export type TimeFatigueConstraint = WorkerOnlyConstraint<{
    taskIds : number[]
    limit : number
}>

export interface ConsecutiveTimeFatigueConstraint {
    [limit : string]: number[]
}

export type TimeUnavailableConstraint = WorkerOnlyConstraint<{
    startTime : Time
    endTime : Time
}>

export interface BuddyNemesisConstraint {
    [taskId : string] : number[]
}

export enum ConstraintType {
    sameTask = 'sameTask',
    sameTime = 'sameTime',
    cannotWork = 'cannotWork',
    mustWork = 'mustWork',
    atLeastWork = 'atLeastWork',
    overallTimeFatigueTotal = 'overallTimeFatigueTotal',
    timeFatigueTotal = 'timeFatigueTotal',
    overallTimeFatigueConsecutive = 'overallTimeFatigueConsecutive',
    unavailable = 'unavailable',
    buddy = 'buddy',
    nemesis = 'nemesis',
    fifa = 'fifa'
}

export type Constraint =
    TimeFatigueConstraint |
    TimeUnavailableConstraint |
    CannotWorkConstraint |
    MustWorkConstraint |
    AtLeastWorkConstraint |
    OverallTimeFatigueTotalConstraint |
    ConsecutiveTimeFatigueConstraint |
    BuddyNemesisConstraint


export interface Constraints {
    overallTimeFatigueTotal ?: OverallTimeFatigueTotalConstraint[]
    timeFatigueTotal ?: TimeFatigueConstraint[]
    overallTimeFatigueConsecutive ?: ConsecutiveTimeFatigueConstraint
    unavailable ?: TimeUnavailableConstraint[]
    cannotWork ?: CannotWorkConstraint[]
    mustWork ?: MustWorkConstraint[]
    atLeastWork ?: AtLeastWorkConstraint[]
    buddy ?: BuddyNemesisConstraint
    nemesis ?: BuddyNemesisConstraint
}

export interface SolverResponse {
    status : boolean
    solutionByTask : SolutionByTask | null
    solutionByWorker : SolutionByWorker | null
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