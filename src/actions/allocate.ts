
import { action } from 'mobx'

import { solveAllocation } from '../solver'
import { Schedule, Task, Worker } from '../data'

import taskStore from '../stores/taskStore'
import workerStore from '../stores/workerStore'
import scheduleStore from '../stores/scheduleStore'
import allocationSolutionStore from '../stores/allocationSolutionStore'

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

    const resp = await solveAllocation(workers, scheduledTasks)

    if (resp && resp.status && scheduleStore.selectedSchedule) {
        allocationSolutionStore.setSolution(resp.solution, scheduleStore.selectedSchedule.id)
    }
})


