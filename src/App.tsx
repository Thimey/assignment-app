import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles, Typography } from '@material-ui/core'
import WorkerIcon from '@material-ui/icons/SentimentSatisfied'
import ScheduleIcon from '@material-ui/icons/Schedule'

import ScheduleMatrix from './views/ScheduleMatrix'
import AllocatedWorkerMatrix from './views/AllocatedWorkerMatrix'
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
import allocationSolutionStore from './stores/allocationSolutionStore'

import AllocationLoader from './components/AllocationLoader'

export enum Display {
    allocatedWorkers = 'allocatedWorkers',
    schedule = 'schedule',
}

const styles = createStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '8px',
        paddingRight: '8px',
        height: '100vh',
    },
    header: {
        height: '80px',
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
        height: 'calc(100% - 80px)',
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

    private toggleMatrixDisplay = () => this.setState((prevState : State) => ({
        display: prevState.display === Display.schedule
            ? Display.allocatedWorkers
            : Display.schedule
    }))

    private renderToggleIcon() {
        if (this.state.display === Display.schedule) {
            return <WorkerIcon onClick={this.toggleMatrixDisplay} />
        } else {
            return <ScheduleIcon onClick={this.toggleMatrixDisplay} />
        }
    }

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

                        {
                            allocationSolutionStore.solutionStatus &&
                            this.renderToggleIcon()
                        }
                    </div>
                </div>

                <div className={classes.matrixContainer}>
                    {
                        display === Display.schedule &&
                        <ScheduleMatrix />
                    }

                    {
                        display === Display.allocatedWorkers &&
                        <AllocatedWorkerMatrix />
                    }
                </div>

                <AllocationLoader />
            </div>
        )
    }
}

export default withStyles(styles)(App)
