import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles, Typography } from '@material-ui/core'
import WorkerIcon from '@material-ui/icons/SentimentSatisfied'
import ScheduleIcon from '@material-ui/icons/Schedule'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'

import ScheduleMatrix from './views/ScheduleMatrix'
import AllocatedWorkerMatrix from './views/AllocatedWorkerMatrix'
import Model from './views/Model'

import {
    getWorkers,
    getTasks,
    getSchedules,
    getCostMatrix,
    getConstraints,
} from './data'
import { SolveOption } from './solver'


import taskStore from './stores/taskStore'
import scheduleStore from './stores/scheduleStore'
import workerStore from './stores/workerStore'
import costStore from './stores/costStore'
import constraintStore from './stores/constraintStore'
import allocationSolutionStore from './stores/allocationSolutionStore'

import AllocationLoader from './components/AllocationLoader'
import AllocateButton from './components/AllocateButton'
import GithubNotificationMessage from './components/GithubNotificationMessage'

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
    allocatedInfoContainer: {
        display: 'flex',
    },
    matrixContainer: {
        height: 'calc(100% - 80px)',
        width: '100%',
    },
    chromeSnack: {
        backgroundColor: '#f2f2f2',
        height: 75,
        padding: 0,
        paddingLeft: 8,
        paddingRight: 12,
    },

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

        window.addEventListener('keydown', (e : any) => {
            if (e.key === 'Alt') {
                constraintStore.toggleDonuts()
            }
        })
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

    private handleClearSolution = () => {
        allocationSolutionStore.purgeSolution()
        this.setState({ display: Display.schedule })
    }

    private renderToggleIcon() {
        if (this.state.display === Display.schedule) {
            return (
                <Button onClick={this.toggleMatrixDisplay}>
                    <WorkerIcon />
                </Button>
            )
        } else {
            return (
                <Button onClick={this.toggleMatrixDisplay}>
                    <ScheduleIcon />
                </Button>
            )
        }
    }

    private handleSnackClose = () => {
        constraintStore.closeGithubSnack()
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

                    <div className={classes.allocatedInfoContainer}>
                        {
                            (
                                allocationSolutionStore.solvedOption &&
                                allocationSolutionStore.solvedOption.option !== SolveOption.noOptimisation &&
                                allocationSolutionStore.objectiveValue) &&
                            <Typography variant="display1" color='primary'>
                                {
                                    allocationSolutionStore.objectiveValue
                                }
                            </Typography>
                        }

                        {
                            allocationSolutionStore.solutionStatus &&
                            <Button onClick={this.handleClearSolution}>
                                Clear
                            </Button>
                        }
                    </div>

                    <div className={classes.subHeader}>
                        {
                            allocationSolutionStore.solutionStatus &&
                            this.renderToggleIcon()
                        }

                        <AllocateButton />

                        {
                            scheduleStore.selectedSchedule &&
                            <Model />
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

                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={constraintStore.githubSnack}
                    onClose={this.handleSnackClose}
                    autoHideDuration={3000}

                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    >
                    <SnackbarContent
                        classes= {{
                            root: classes.chromeSnack,

                        }}
                        message={
                            <GithubNotificationMessage />
                        }
                    />
                </Snackbar>
            </div>
        )
    }
}

export default withStyles(styles)(App)
