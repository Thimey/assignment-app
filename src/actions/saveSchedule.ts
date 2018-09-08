import { action } from 'mobx'

import { saveSchedule, Schedule } from '../data'


import scheduleStore from '../stores/scheduleStore'

export default action('saveSchedule', async (schedule : Partial<Schedule>) => {
    const newSchedule = { ...schedule, tasks: [] }
    const resp = await saveSchedule(newSchedule)

    scheduleStore.updateSchedule(resp)
})
