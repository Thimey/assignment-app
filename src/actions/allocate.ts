
import { action } from 'mobx'

import { solveAllocation, SolveOption } from '../solver'
import { Schedule, Task, Worker } from '../data'

import taskStore from '../stores/taskStore'
import workerStore from '../stores/workerStore'
import scheduleStore from '../stores/scheduleStore'
import constraintStore from '../stores/constraintStore'
import costStore from '../stores/costStore'
import allocationSolutionStore from '../stores/allocationSolutionStore'


export default action('allocate', async ({
    schedule,
    selectedWorkerIds,
    solverOption,
    time,
}: {
    schedule : Schedule,
    selectedWorkerIds : number[],
    solverOption : SolveOption,
    time : number | null
}) => {
    // Purge prev solution if any
    allocationSolutionStore.purgeSolution()

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
    const costMatrix = costStore.getMatrixForAllocating(scheduledTasks)

    // Set loading state and allocated workers
    allocationSolutionStore.setSolvingSolution(solverOption, time)
    allocationSolutionStore.setAllocatingWorkers(workers)

    // get custom constraints
    const constraints = constraintStore.getConstraintsForSolver() || undefined

    const resp = await solveAllocation({
        workers,
        scheduledTasks,
        costMatrix,
        solverOption,
        timeLimit: time,
        constraints,
    })

    if (resp && resp.status && scheduleStore.selectedSchedule) {
        allocationSolutionStore.setSolution({
            ...resp,
            selectedScheduleId: scheduleStore.selectedSchedule.id,
        })

        return resp.status
    }

    allocationSolutionStore.setSolutionStatus(false)

    return false
})


