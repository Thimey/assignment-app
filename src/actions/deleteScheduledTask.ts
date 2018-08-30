import { action } from 'mobx'

import { updateSchedule } from '../data'
import scheduleStore from '../stores/scheduleStore'

export default action('deleteScheduledTask', async (scheduledTaskId : string) => {
    const selectedSchedule = scheduleStore.selectedSchedule

    if (selectedSchedule) {
        const newSchedule = {
            ...selectedSchedule,
            tasks: selectedSchedule.tasks.filter(({ id }) => scheduledTaskId !== id)
        }

        // Update db
        await updateSchedule(selectedSchedule.id)(newSchedule)

        // Update store
        scheduleStore.updateSchedule(newSchedule)
    }
})