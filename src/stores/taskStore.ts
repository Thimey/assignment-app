import { observable, action, computed, values, ObservableMap } from 'mobx'

import { Task } from '../data'

class TaskStore {
    private taskMap : ObservableMap<number, Task> = observable.map()

    @action.bound
    public addTasks(tasks : Task[]) {
        tasks.forEach(task =>
            this.taskMap.set(task.id, task)
        )
    }

    @action.bound
    public updateTask(newTask : Task) {
        this.taskMap.set(newTask.id, newTask)
    }

    @computed
    public get tasks() {
        return values(this.taskMap)
    }


}


const instance = new TaskStore()

export default instance
