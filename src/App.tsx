import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import CostMatrix from './views/CostMatrix'
import ScheduleMatrix from './views/ScheduleMatrix'
import AllocateSchedule from './views/AllocateSchedule'

import {
    getWorkers,
    getTasks,
    getSchedules,
} from './data'

import taskStore from './stores/taskStore'
import scheduleStore from './stores/scheduleStore'
import workerStore from './stores/workerStore'

export enum Display {
    costMatrix = 'costMatrix',
    schedule = 'schedule',
}

const styles = createStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '8px',
        height: '100vh',
        width: '100%',
    },
    header: {
        height: '50px',
    },
    matrixContainer: {
        height: 'calc(100% - 50px)',
        width: '100%',
    }
})

export interface State {
    display : Display
}

@observer
class App extends React.Component<WithStyles<typeof styles>, State> {
    state : State = {
        display: Display.schedule,
    }

    componentDidMount() {
        this.getTasks()
        this.getWorkers()
        this.getSchedules()
    }

    private getWorkers = async () => workerStore.addWorkers(await getWorkers())
    private getTasks = async () => taskStore.addTasks(await getTasks())
    private getSchedules = async () => scheduleStore.addSchedules(await getSchedules())

    public render() {
        const { display } = this.state
        const { classes } = this.props

        return (
            <div className={classes.container}>

                <div className={classes.header}>
                    {
                        scheduleStore.selectedSchedule &&
                        <AllocateSchedule />
                    }
                </div>

                <div className={classes.matrixContainer}>
                    {
                        display === Display.costMatrix &&
                        <CostMatrix />
                    }

                    {
                        display === Display.schedule &&
                        <ScheduleMatrix />
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(App)
