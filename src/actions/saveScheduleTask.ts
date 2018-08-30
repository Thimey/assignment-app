import { action } from 'mobx'
import * as uuid from 'uuid'

import { updateSchedule, Time } from '../data'


import scheduleStore from '../stores/scheduleStore'

export default action('saveScheduleTask', async (endTime : Time) => {
    const selectedSchedule = scheduleStore.selectedSchedule
    const selectedTimeTask = scheduleStore.selectedTimeTask

    if (selectedSchedule && selectedTimeTask) {
        const newScheduledTask = {
            id: uuid(),
            taskId: selectedTimeTask.task.id,
            startTime: selectedTimeTask.time,
            endTime,
        }

        const newSchedule = {
            ...selectedSchedule,
            tasks: [
                ...selectedSchedule.tasks,
                newScheduledTask,
            ]
        }

        // Update db
        await updateSchedule(selectedSchedule.id)(newSchedule)

        // Update UI
        scheduleStore.updateSchedule(newSchedule)
    }
})
