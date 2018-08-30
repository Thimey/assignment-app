import { action } from 'mobx'

import { saveSchedule, Schedule } from '../data'


import scheduleStore from '../stores/scheduleStore'

export default action('saveSchedule', async (schedule : Schedule) => {
    await saveSchedule(schedule)
    scheduleStore.updateSchedule(schedule)
})
