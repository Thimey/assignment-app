import { observable, action, ObservableMap } from 'mobx'

import workerStore from './workerStore'

import { Solution } from '../solver'

class AllocationSolutionStore {
    private solutionMap : ObservableMap<string, number[]> = observable.map()

    @observable
    public solutionScheduleId : number | null = null

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
