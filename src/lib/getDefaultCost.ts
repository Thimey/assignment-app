import { Worker, Task, WorkerTags } from '../data'

function hasTag(tag : WorkerTags, worker : Worker) {
    return worker.tags.indexOf(tag) > -1
}

function randomInRange(min : number, max : number) {
    return Math.round(Math.random() * (max - min) + min)
}

function costDemo(
    worker : Worker,
    type : WorkerTags
) {
    if (hasTag(WorkerTags.sales, worker)) {
        if (hasTag(type, worker)) {
            return randomInRange(1, 10)
        }

        return randomInRange(10, 20)
    }

    if (hasTag(WorkerTags.cs, worker)) {
        return randomInRange(30, 50)
    }

    if (hasTag(WorkerTags.marketing, worker)) {
        return randomInRange(50, 70)
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

function costTraining(worker : Worker) {
    if (hasTag(WorkerTags.cs, worker)) {
        return randomInRange(1, 10)
    }

    return randomInRange(80, 100)
}

function costFontCrisis(worker : Worker) {
    if (hasTag(WorkerTags.ux, worker)) {
        return randomInRange(1, 10)
    }

    return randomInRange(80, 100)
}

function costRelease(
    worker : Worker,
    type : WorkerTags
) {
    if (hasTag(WorkerTags.engineer, worker)) {
        if (hasTag(type, worker)) {
            return randomInRange(1, 10)
        }

        return randomInRange(10, 20)
    }

    return randomInRange(90, 100)
}

function costGreetStrangers(worker : Worker) {
    if(hasTag(WorkerTags.dog, worker)) {
        return randomInRange(1, 2)
    }

    return randomInRange(80, 100)
}

function costFrisbee(worker : Worker) {
    if (worker.name === 'simon') {
        return 1
    }

    if (hasTag(WorkerTags.frisbee, worker)) {
        return randomInRange(1, 30)
    }

    return randomInRange(80, 90)
}

function costBBQ(worker : Worker) {
    if (hasTag(WorkerTags.brazil, worker)) {
        return randomInRange(1, 10)
    }

    if (worker.name === 'trent' || worker.name === 'jon') {
        return randomInRange(30, 40)
    }

    return randomInRange(80, 90)
}

function costVollyBall(worker : Worker) {
    if(hasTag(WorkerTags.vollyball, worker)) {
        return randomInRange(1, 10)
    }

    return randomInRange(40, 90)
}

function costKitchenDuty(worker : Worker) {
    if(worker.name === 'jarren') {
        return randomInRange(1, 10)
    }

    return randomInRange(40, 90)
}

function costSalesMeeting(worker : Worker) {
    if(hasTag(WorkerTags.sales, worker)) {
        return randomInRange(1, 10)
    }

    return randomInRange(80, 100)
}

function costStandup(worker : Worker) {
    if(hasTag(WorkerTags.engineer, worker)) {
        return randomInRange(1, 10)
    }

    return randomInRange(80, 100)
}

function costLeadershipMeeting(worker : Worker) {
    if(hasTag(WorkerTags.leadership, worker)) {
        return randomInRange(1, 10)
    }

    return randomInRange(80, 90)
}

function costShowStopper(worker : Worker) {
    if (hasTag(WorkerTags.engineer, worker)) {
        return randomInRange(1, 10)
    }

    return randomInRange(90, 100)
}

function costCampaignLaunch(worker : Worker) {
    if (hasTag(WorkerTags.marketing, worker)) {
        return randomInRange(1, 10)
    }

    return randomInRange(90, 100)
}


function getDefaultCost(worker : Worker, task : Task) {
    if (task.id === 0 || task.id === 1) {
        return costFifa(worker)
    }

    if (task.id === 2) {
        return costMarioKart(worker)
    }

    if (task.id === 3) {
        return costDemo(worker, WorkerTags.syd)
    }

    if (task.id === 4) {
        return costDemo(worker, WorkerTags.usa)
    }

    if (task.id === 5) {
        return costDemo(worker, WorkerTags.melb)
    }

    if (task.id === 6) {
        return costDemo(worker, WorkerTags.bris)
    }

    if (task.id === 7) {
        return costCoffee(worker)
    }

    if (task.id === 8) {
        return costGreetStrangers(worker)
    }

    if (task.id === 9) {
        return costTraining(worker)
    }

    if (task.id === 10) {
        return costRelease(worker, WorkerTags.syd)
    }

    if (task.id === 11) {
        return costRelease(worker, WorkerTags.prague)
    }

    if (task.id === 12) {
        return costFrisbee(worker)
    }

    if (task.id === 13) {
        return costBBQ(worker)
    }

    if (task.id === 14) {
        return costVollyBall(worker)
    }

    if (task.id === 15) {
        return costKitchenDuty(worker)
    }

    if (task.id === 16) {
        return costIkea(worker)
    }

    if (task.id === 17) {
        return costSalesMeeting(worker)
    }

    if (task.id === 18 || task.id === 23) {
        return costStandup(worker)
    }

    if (task.id === 19) {
        return costFontCrisis(worker)
    }

    if (task.id === 20) {
        return costShowStopper(worker)
    }

    if (task.id === 21) {
        return costCampaignLaunch(worker)
    }

    if (task.id === 22) {
        return costLeadershipMeeting(worker)
    }

    return 10
}

export default getDefaultCost
