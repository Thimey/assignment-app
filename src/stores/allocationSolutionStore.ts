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
    public setSolution(solution : Solution | null, selectedScheduleId : number) {
        if (!solution) {
            this.solutionMap.clear()
            this.solutionScheduleId = null
        } else {
            Object.keys(solution).forEach(schTaskId => {
                this.solutionMap.set(schTaskId, solution[schTaskId])
                this.solutionScheduleId = selectedScheduleId
            })
        }
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
