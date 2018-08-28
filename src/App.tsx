import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import * as uuid from 'uuid'

import TaskScheduleDialog from './components/TaskScheduleDialog'
import CostMatrix from './views/CostMatrix'
import ScheduleMatrix, { ScheduleData } from './views/ScheduleMatrix'

import {
    getWorkers,
    getTasks,
    getSchedules,
    saveSchedule,
    updateSchedule,
    Schedule,
    Task,
    Time,
    Worker,
} from './data'

export enum Display {
    costMatrix = 'costMatrix',
    schedule = 'schedule',
}

const styles = createStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
    }
})

export interface State {
    display : Display
    workers : Worker[],
    tasks : Task[]
    schedules : Schedule[]
    selectedSchedule : Schedule | null
    dataToSchedule : ScheduleData | null
}


class App extends React.Component<WithStyles<typeof styles>, State> {
    state : State = {
        display: Display.schedule,
        workers: [],
        tasks: [],
        schedules: [],
        dataToSchedule: null,
        selectedSchedule: null,
    }

    componentDidMount() {
        this.getTasks()
        this.getWorkers()
        this.getSchedules()
    }

    private getWorkers = async () => this.setState({ workers: await getWorkers() })
    private getTasks = async () => this.setState({ tasks: await getTasks() })
    private getSchedules = async () => this.setState({ schedules: await getSchedules() })

    private saveSchedule = async (schedule : Schedule) => {
        await saveSchedule(schedule)
        this.getSchedules()
    }

    private openSaveTaskToSchedule = (scheduleData : ScheduleData) =>
        this.setState({ dataToSchedule: scheduleData })

    private closeSaveTaskToSchedule = () =>
        this.setState({ dataToSchedule: null })

    private onTaskScheduleSave = async (endTime : Time) => {
        const {
            selectedSchedule,
            dataToSchedule,
        } = this.state

        if (selectedSchedule && dataToSchedule) {
            const newScheduledTask = {
                id: uuid(),
                taskId: dataToSchedule.task.id,
                startTime: dataToSchedule.time,
                endTime,
            }

            const newSchedule = {
                ...selectedSchedule,
                tasks: [
                    ...selectedSchedule.tasks,
                    newScheduledTask,
                ]
            }

            await updateSchedule(selectedSchedule.id)(newSchedule)

            const newSchedules = await getSchedules()

            this.setState({ schedules: [...newSchedules] })
        }
        this.closeSaveTaskToSchedule()
    }

    private onScheduleSelect = (selectedSchedule : Schedule) => this.setState({ selectedSchedule })

    public render() {
        const { display, dataToSchedule, selectedSchedule } = this.state
        return (
            <React.Fragment>
                <div className={this.props.classes.container}>

                    {
                        display === Display.costMatrix &&
                        <CostMatrix
                            workers={this.state.workers}
                            tasks={this.state.tasks}
                        />
                    }

                    {
                        display === Display.schedule &&
                        <ScheduleMatrix
                            onScheduleSelect={this.onScheduleSelect}
                            selectedScheduleId={selectedSchedule ? selectedSchedule.id : null}
                            schedules={this.state.schedules}
                            tasks={this.state.tasks}
                            saveSchedule={this.saveSchedule}
                            onCellClick={this.openSaveTaskToSchedule}
                        />
                    }
                </div>

                <TaskScheduleDialog
                    startTime={dataToSchedule
                        ? dataToSchedule.time
                        : null

                    }
                    onSave={this.onTaskScheduleSave}
                    onClose={this.closeSaveTaskToSchedule}
                />
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(App)
