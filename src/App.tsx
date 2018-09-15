import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles, Typography } from '@material-ui/core'

import ScheduleMatrix from './views/ScheduleMatrix'
import AllocateSchedule from './views/AllocateSchedule'

import {
    getWorkers,
    getTasks,
    getSchedules,
    getCostMatrix,
    getConstraints,
} from './data'

import taskStore from './stores/taskStore'
import scheduleStore from './stores/scheduleStore'
import workerStore from './stores/workerStore'
import costStore from './stores/costStore'
import constraintStore from './stores/constraintStore'

import AllocationLoader from './components/AllocationLoader'

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
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',

    },
    subHeader: {
        display: 'flex',
        alignItems: 'center',
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
        this.getCostMatrix()
        this.getConstraints()
    }

    private getWorkers = async () => workerStore.addWorkers(await getWorkers())
    private getTasks = async () => taskStore.addTasks(await getTasks())
    private getSchedules = async () => scheduleStore.addSchedules(await getSchedules())
    private getCostMatrix = async () => costStore.addCostMatrices(await getCostMatrix())
    private getConstraints = async () => constraintStore.addConstraints(await getConstraints())

    public render() {
        const { display } = this.state
        const { classes } = this.props

        return (
            <div className={classes.container}>

                <div className={classes.header}>
                    <Typography variant="display1">
                        Task Assignment
                    </Typography>

                    <div className={classes.subHeader}>
                        {
                            scheduleStore.selectedSchedule &&
                            <AllocateSchedule />
                        }
                    </div>
                </div>

                <div className={classes.matrixContainer}>
                    {
                        display === Display.schedule &&
                        <ScheduleMatrix />
                    }
                </div>

                <AllocationLoader />
            </div>
        )
    }
}

export default withStyles(styles)(App)
