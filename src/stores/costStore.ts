import { observable, action, ObservableMap, when, values, keys, computed } from 'mobx'

import { Worker, Task, SavedCostMatrix } from '../data'
import workerStore from '../stores/workerStore'
import taskStore from '../stores/taskStore'

import getDefaultCost from '../lib/getDefaultCost'

import { ScheduledTaskForSolver } from '../solver'

class CostStore {
    constructor() {
        when(
            () => workerStore.workers.length > 0 && taskStore.tasks.length > 0,
            () => this.initialiseMatrix()
        )
    }

    private costMap : ObservableMap<string, number> = observable.map()

    @observable
    public selectedCostMatrixId : number | null = null
    private savedMatricesMap : ObservableMap<number, SavedCostMatrix> = observable.map()

    @observable
    public matrixTaskFilter : string = ''

    @observable
    public matrixWorkerFilter : string = ''

    @action.bound
    public onTaskFilter(filter : string) {
        this.matrixTaskFilter = filter
    }

    @action.bound
    public onWorkerFilter(filter : string) {
        this.matrixWorkerFilter = filter
    }

    public getSavedMatrix(id : number) {
        return this.savedMatricesMap.get(id)
    }

    @computed
    public get savedMatrices() {
        return values(this.savedMatricesMap)
    }

    @action.bound
    public addCostMatrices(savedCostMatrix : SavedCostMatrix[]) {
        savedCostMatrix.forEach(mat =>
            this.savedMatricesMap.set(mat.id, mat)
        )
    }

    @computed
    public get currentCostMatrix() {
        const matrix = {}
        this.costMap.forEach((cost, key) => {
            const { workerId, taskId } = this.getIdsFromKey(key)

            if (matrix[workerId]) {
                matrix[workerId][taskId] = cost
            } else {
                matrix[workerId] = { [taskId]: cost }
            }
        })

        return matrix
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
    public loadCostMatrix(id : number) {
        const costMatrixToLoad = this.savedMatricesMap.get(id)

        if (costMatrixToLoad) {
            keys(costMatrixToLoad.costMatrix).forEach(workerId =>
                keys(costMatrixToLoad.costMatrix[workerId]).forEach(schTaskId =>
                    this.costMap.set(
                        this.getCostMapKey(workerId, schTaskId),
                        costMatrixToLoad.costMatrix[workerId][schTaskId]
                    )
                )
            )
            this.selectedCostMatrixId = costMatrixToLoad.id
        }
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

    public getMatrixForAllocating(scheduledTasks : ScheduledTaskForSolver[]) {
        return workerStore.workers.reduce((acc, worker) => ({
            ...acc,
            [worker.id]: scheduledTasks.reduce((acc, schTask) => ({
                ...acc,
                [schTask.id]: this.getCost(worker, schTask.task)
            }), {})
        }), {})
    }
}


const instance = new CostStore()

export default instance
