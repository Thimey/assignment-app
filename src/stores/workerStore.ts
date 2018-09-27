import { observable, action, computed, values, ObservableMap } from 'mobx'

import { Worker } from '../data'
import modelStore from './modelStore'

class WorkerStore {
    private workerMap : ObservableMap<number, Worker> = observable.map()

    @action.bound
    public addWorkers(workers : Worker[]) {
        workers.forEach(worker =>
            this.workerMap.set(worker.id, worker)
        )

        modelStore.setSelectedWorkerIds(this.workers.map(w => w.id))
    }

    @action.bound
    public updateWorker(newWorker : Worker) {
        this.workerMap.set(newWorker.id, newWorker)
    }

    @computed
    public get workers() {
        return values(this.workerMap) as Worker[]
    }

    public getWorker = (id : number) => {
        return this.workerMap.get(id)
    }
}


const instance = new WorkerStore()

export default instance
