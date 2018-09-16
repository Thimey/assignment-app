import { observable, action, ObservableMap, computed } from 'mobx'

import workerStore from './workerStore'
import scheduleStore from './scheduleStore'
import { Worker, ScheduledTask } from '../data'

import { getTimeOverlayPx } from '../lib/time'

import { SolutionByTask, SolutionByWorker } from '../solver'

export enum SolveOption {
    noOptimisation = 'noOptimisation',
    optimise = 'optimise',
    optimal = 'optimal',
}

class AllocationSolutionStore {
    private solutionByTaskMap : ObservableMap<string, number[]> = observable.map()
    private solutionByWorkerMap : ObservableMap<string, string[]> = observable.map()

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
        this.solutionByTaskMap.clear()
        this.solutionByWorkerMap.clear()
    }

    @action.bound
    public setSolution({
        objectiveValue,
        status,
        solutionByWorker,
        solutionByTask,
        selectedScheduleId,
    } : {
        objectiveValue : number | null
        status : boolean
        solutionByWorker : SolutionByWorker | null,
        solutionByTask : SolutionByTask | null,
        selectedScheduleId : number
    }) {
        if (!status) {
            this.solutionByTaskMap.clear()
            this.solutionScheduleId = null
        } else {
            Object.keys(solutionByTask!).forEach(schTaskId => {
                this.solutionByTaskMap.set(schTaskId, solutionByTask![schTaskId])
                this.solutionScheduleId = selectedScheduleId
            })

            Object.keys(solutionByWorker!).forEach(workerId => {
                this.solutionByWorkerMap.set(workerId, solutionByWorker![workerId])
                this.solutionScheduleId = selectedScheduleId
            })
        }

        this.solutionStatus = status
        this.objectiveValue = objectiveValue
    }

    public getScheduledTaskAllocated(scheduleTaskId : string) {
        const workerIds = this.solutionByTaskMap.get(scheduleTaskId)

        return workerIds
            ?  workerIds.map(workerStore.getWorker)
            : null
    }

    public getWorkerAllocated(workerId : number, scheduledTasks : ScheduledTask[]) {
        const scheduledTaskIds = this.solutionByWorkerMap.get(String(workerId))

        if (scheduledTaskIds) {
            return scheduledTaskIds.map(schId => scheduledTasks.find(({ id }) => id === schId))
        }

        return []
    }

    @computed
    public get allocatedScheduledTasks() {
        const selectedSchedule = scheduleStore.selectedSchedule

        // if (selectedSchedule) {
        //     const scheduledTasks = selectedSchedule.tasks
        //     workerStore.workers.map(worker =>
        //         this.getWorkerAllocated(worker.id, scheduledTasks)
        //     )
        // }

        if (selectedSchedule) {
            return workerStore.workers.reduce((acc, worker) => ([
                ...acc,
                selectedSchedule.tasks
                    .filter(schTask => {
                        const allocatedSchTaskIds = this.solutionByWorkerMap.get(String(worker.id))

                        return allocatedSchTaskIds && allocatedSchTaskIds.indexOf(schTask.id) >= 0
                    })
                    .map(scheduledTask => ({
                        ...getTimeOverlayPx(scheduledTask),
                        data: {
                            worker,
                            scheduledTask
                        },
                    })),
            ]), [])
        }

        return []
    }
}


const instance = new AllocationSolutionStore()

export default instance
