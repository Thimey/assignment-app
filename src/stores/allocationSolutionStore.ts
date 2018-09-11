import { observable, action, ObservableMap } from 'mobx'

import workerStore from './workerStore'
import { Worker } from '../data'

import { Solution } from '../solver'

export enum SolveOption {
    noOptimisation = 'noOptimisation',
    optimise = 'optimise',
    optimal = 'optimal',
}

class AllocationSolutionStore {
    private solutionMap : ObservableMap<string, number[]> = observable.map()

    @observable
    public solutionScheduleId : number | null = null

    @observable
    public objectiveValue : number | null = null

    @observable
    public solutionStatus : boolean | null = null

    @action.bound
    public setSolutionStatus(status : boolean | null) {
        this.solutionStatus = status
    }

    @observable
    public solving : {
        option : SolveOption
        time : number | null
    } | null = null

    @observable
    public allocatingWorkers : Worker[] = []

    @action.bound
    public setAllocatingWorkers(workers : Worker[]) {
        this.allocatingWorkers = workers
    }

    @action.bound
    public setSolvingSolution(option : SolveOption, time : number | null = null) {
        this.solving = { option, time }
    }

    @action.bound
    public finishedSolving() {
        this.solving = null
    }

    @action.bound
    public purgeSolution() {
        this.solutionStatus = null
        this.objectiveValue = null
        this.solutionMap.clear()
    }

    @action.bound
    public setSolution({
        objectiveValue,
        status,
        solution,
        selectedScheduleId,
    } : {
        objectiveValue : number | null
        status : boolean
        solution : Solution | null,
        selectedScheduleId : number
    }) {
        if (!solution) {
            this.solutionMap.clear()
            this.solutionScheduleId = null
        } else {
            Object.keys(solution).forEach(schTaskId => {
                this.solutionMap.set(schTaskId, solution[schTaskId])
                this.solutionScheduleId = selectedScheduleId
            })
        }

        this.solutionStatus = status
        this.objectiveValue = objectiveValue
    }

    public getAllocated(scheduleTaskId : string) {
        const workerIds = this.solutionMap.get(scheduleTaskId)

        return workerIds
            ?  workerIds.map(workerStore.getWorker)
            : null
    }
}


const instance = new AllocationSolutionStore()

export default instance
