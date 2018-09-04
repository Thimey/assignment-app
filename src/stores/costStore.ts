import { observable, action, ObservableMap, when, values } from 'mobx'

import { CostMatrix, Worker, Task, ScheduledTask } from '../data'
import workerStore from '../stores/workerStore'
import taskStore from '../stores/taskStore'
import getDefaultCost from '../lib/getDefaultCost'

class CostStore {
    constructor() {
        when(
            () => workerStore.workers.length > 0 && taskStore.tasks.length > 0,
            () => this.initialiseMatrix()
        )
    }

    private initialiseMatrix() {
        if (values(this.costMap).length < 1) {
            workerStore.workers.forEach((worker) => {
                taskStore.tasks.forEach((task) => {
                    this.costMap.set(
                        this.getCostMapKey(worker.id, task.id),
                        getDefaultCost(worker, task)
                    )
                })
            })
        }
    }

    private costMap : ObservableMap<string, number> = observable.map()

    private getCostMapKey(workerId : string | number, taskId : string | number) {
        return `${workerId}-${taskId}`
    }

    private getIdsFromKey(key : string) {
        const [workerId, taskId] =  key.split('-')

        return {
            workerId: parseInt(workerId, 10),
            taskId: parseInt(taskId, 10)
        }
    }

    public getCost(worker : Worker, task : Task) {
        return this.costMap.get(this.getCostMapKey(worker.id, task.id)) || getDefaultCost(worker, task)
    }

    @action.bound
    public loadCostMatrix(costMatrix : CostMatrix) {
        Object.keys(costMatrix).forEach(workerId =>
            Object.keys(costMatrix[workerId]).forEach(schTaskId =>
                this.costMap.set(
                    this.getCostMapKey(workerId, schTaskId),
                    costMatrix[workerId][schTaskId]
                )
            )
        )
    }

    @action.bound
    public updateCostMatrix(workerId : number, taskId : number, cost : number) {
        this.costMap.set(
            this.getCostMapKey(workerId, taskId),
            cost
        )
    }

    @action.bound
    public restoreDefault() {
        this.costMap.forEach((_v, key) => {
            const { workerId, taskId } = this.getIdsFromKey(key)

            const worker = workerStore.getWorker(workerId)
            const task = taskStore.getTask(taskId)

            const defaultCost = (worker && task)
                ? getDefaultCost(worker, task)
                : 50

            this.costMap.set(
                key,
                defaultCost
            )
        })
    }

    public getMatrix(scheduledTasks : ScheduledTask[]) {
        const matrix = {}
        this.costMap.forEach((cost, key) => {
            const { workerId, taskId } = this.getIdsFromKey(key)

            if (matrix[workerId]) {
                matrix[taskId] = cost
            } else {
                matrix[workerId] = { [taskId]: cost }
            }

        })

        return matrix
    }
}


const instance = new CostStore()

export default instance
