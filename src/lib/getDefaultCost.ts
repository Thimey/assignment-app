import { Worker, Task, WorkerTags } from '../data'

function hasTag(tag : WorkerTags, worker : Worker) {
    return worker.tags.indexOf(tag) > -1
}

function randomInRange(min : number, max : number) {
    return Math.round(Math.random() * (max - min) + min)
}

function costDemo(worker : Worker) {
    if (hasTag(WorkerTags.sales, worker)) {
        return randomInRange(1, 10)
    }

    if (hasTag(WorkerTags.cs, worker)) {
        return randomInRange(20, 40)
    }

    if (hasTag(WorkerTags.marketing, worker)) {
        return randomInRange(40, 70)
    }

    if (hasTag(WorkerTags.ux, worker)) {
        return randomInRange(80, 100)
    }

    if (hasTag(WorkerTags.engineer, worker)) {
        return randomInRange(90, 100)
    }

    return randomInRange(80, 100)
}

function costFifa(worker : Worker) {
    if (hasTag(WorkerTags.fifa, worker)) {
        return randomInRange(1, 20)
    }

    return randomInRange(70, 100)
}

function costMarioKart(worker : Worker) {
    if (hasTag(WorkerTags.marioKart, worker)) {
        return randomInRange(1, 20)
    }

    return randomInRange(70, 100)
}

function costIkea(worker : Worker) {
    if (worker.name === 'gav') {
        return randomInRange(1, 10)
    }

    return randomInRange(40, 100)
}

function costCoffee(worker : Worker) {
    if (worker.name === 'simon' || worker.name === 'adam') {
        return randomInRange(1, 10)
    }

    if (worker.name === 'marko' || worker.name === 'noel') {
        return randomInRange(20, 40)
    }

    return randomInRange(80, 100)
}

function getDefaultCost(worker : Worker, task : Task) {
    if (task.id === 0 || task.id === 1) {
        return costFifa(worker)
    }

    if (task.id === 2) {
        return costMarioKart(worker)
    }

    if (task.id === 3) {
        return costDemo(worker)
    }

    if (task.id === 4) {
        return costIkea(worker)
    }


    if (task.id === 5) {
        return costCoffee(worker)
    }

    return 10
}

export default getDefaultCost
