import { observable, IObservableArray, action, computed } from 'mobx'

import { SolveOption } from '../solver'
import scheduleStore from './scheduleStore'

class ModelStore {
    public selectedWorkerIds : IObservableArray<number> = observable([])

    @observable
    public selectedSolution : SolveOption = SolveOption.noOptimisation

    @observable
    public timeLimit: null | number = null

    @action.bound
    public setSelectedWorkerIds(newSelectedWorkerIds : number[]) {
        this.selectedWorkerIds.replace(newSelectedWorkerIds)
    }

    @action.bound
    public setSolverOption(solveOption : SolveOption) {
        this.selectedSolution = solveOption

        if (solveOption === SolveOption.noOptimisation) {
            this.timeLimit = null
        }
    }

    @action.bound
    public setTimeLimit(timeLimit : number | null) {
        this.timeLimit = timeLimit
    }

    @computed
    public get canAllocate() {
        return scheduleStore.selectedSchedule && this.selectedWorkerIds.length
    }
}

const instance = new ModelStore()

export default instance
