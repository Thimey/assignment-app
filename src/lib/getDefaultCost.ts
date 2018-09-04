import { Worker, Task, WorkerTags } from '../data'

function costDemo(worker : Worker) {
    return worker.tags.indexOf(WorkerTags.sales) > -1
        ? 1
        : 50
}

function costFifa(worker : Worker) {
    if (worker.name === 'emma') {
        return 99
    }

    return 10
}

function getDefaultCost(worker : Worker, task : Task) {
    if (task.id === 3) {
        return costDemo(worker)
    }

    if (task.id === 1) {
        return costFifa(worker)
    }

    if (task.id === 5 && worker.name === 'simon') {
        return 0
    }

    return 10
}

export default getDefaultCost
