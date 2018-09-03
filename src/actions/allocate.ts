
import { action } from 'mobx'

import { solveAllocation } from '../solver'
import { Schedule, Task, Worker } from '../data'

import taskStore from '../stores/taskStore'
import workerStore from '../stores/workerStore'
import scheduleStore from '../stores/scheduleStore'
import allocationSolutionStore from '../stores/allocationSolutionStore'

import getCost from '../lib/getCost'

export default action('allocate', async (schedule : Schedule, selectedWorkerIds : number[]) => {

    // Populate scheduledTasks with task values
    const scheduledTasks = schedule.tasks.map(({ id, startTime, endTime, taskId }) => ({
        id,
        startTime,
        endTime,
        task: taskStore.getTask(taskId) as Task
    }))

    // populate selected workers
    const workers = selectedWorkerIds.map(workerStore.getWorker) as Worker[]

    // Get cost matrix
    const costMatrix = workers.reduce((acc, worker) => ({
        ...acc,
        [worker.id]: scheduledTasks.reduce((acc, schTask) => ({
            ...acc,
            [schTask.id]: getCost(worker, schTask.task),
        }), {})
    }), {})

    const resp = await solveAllocation(workers, scheduledTasks, costMatrix)

    if (resp && resp.status && scheduleStore.selectedSchedule) {
        allocationSolutionStore.setSolution(resp.solution, scheduleStore.selectedSchedule.id)
    }
})


