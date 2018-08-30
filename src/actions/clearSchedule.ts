
import { action } from 'mobx'

import { updateSchedule } from '../data'

import scheduleStore from '../stores/scheduleStore'

export default action('clearSchedule', async () => {
    const selectedSchedule = scheduleStore.selectedSchedule

    if (selectedSchedule) {
        const newSchedule = {
            ...selectedSchedule,
            tasks: []
        }

        await updateSchedule(selectedSchedule.id)(newSchedule)

        scheduleStore.updateSchedule(newSchedule)
    }
})


