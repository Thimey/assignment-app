import { observable, action, computed, values, ObservableMap } from 'mobx'

import { getTimeOverlayPx } from '../lib/time'
import taskStore from './taskStore'
import { Schedule, Time, Task } from '../data'

export interface TimeTask {
    time : Time
    task : Task
}

class ScheduleStore {

    private schedulesMap : ObservableMap<number, Schedule> = observable.map()

    @action.bound
    public addSchedules(schedules : Schedule[]) {
        schedules.forEach(schedule =>
            this.schedulesMap.set(schedule.id, schedule)
        )

        // Set first ont to selected
        this.selectedScheduleId = schedules[0].id
    }

    @action.bound
    public updateSchedule(newSchedule : Schedule) {
        this.schedulesMap.set(newSchedule.id, newSchedule)
    }

    @computed
    public get schedules() {
        return values(this.schedulesMap)
    }

    @observable
    private selectedScheduleId : number | null = null

    @action.bound
    public setSelectedScheduleId(id : number) {
        this.selectedScheduleId = id
    }

    @computed
    public get selectedSchedule() {
        return this.selectedScheduleId
            ? this.schedulesMap.get(this.selectedScheduleId)
            : null
    }

    @computed
    public get selectedScheduledTasks() {
        const selectedSchedule = this.selectedScheduleId === null
            ? null
            : this.schedules.find(s => s.id === this.selectedScheduleId)

        if (!selectedSchedule) {
            return []
        }

        return taskStore.tasks.reduce((acc, task) => ([
            ...acc,
            selectedSchedule.tasks
                .filter(schTask => schTask.taskId === task.id )
                .map(scheduledTask => ({
                    ...getTimeOverlayPx(scheduledTask),
                    data: {
                        task,
                        scheduledTask
                    },
                })),
        ]), [])
    }

    @observable
    public selectedTimeTask : TimeTask | null = null

    @action.bound
    public setSelectedTimeTask(timeTask : TimeTask | null) {
        this.selectedTimeTask = timeTask
    }

}


const instance = new ScheduleStore()

export default instance
