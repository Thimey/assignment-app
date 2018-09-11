import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'

import { Worker } from '../data'
import allocationSolutionStore, { SolveOption } from '../stores/allocationSolutionStore'

import WorkerAvatar from './WorkerAvatar'
import SolverProgress from './SolverProgress'

const styles = createStyles({
    workersContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '25px'
    },
    workerContainer: {
        marginRight: '5px',
        marginTop: '5px',
    },
    header: {
        textAlign: 'center',
    },
    progress: {
        marginTop: '25px',
    }
})

export interface Props extends WithStyles<typeof styles> {

}

export interface State {
}

const solverOptionsDisplay = {
    [SolveOption.noOptimisation]: 'Solving with no optimisation',
    [SolveOption.optimise]: 'Finding optimised solution',
    [SolveOption.optimal]: 'Finding optimal solution',
}

@observer
class AllocationLoader extends React.Component<Props, State> {
    state : State = { }

    private renderWorkerDisplay = (worker : Worker) => (
        <div key={worker.id} className={this.props.classes.workerContainer}>
            <WorkerAvatar worker={worker} />
        </div>
    )

    private handleCloseLoader = () => {
        allocationSolutionStore.finishedSolving()
    }

    render() {
        const {
            classes,
        } = this.props

        return (
            <Dialog
                open={allocationSolutionStore.solving !== null}
            >
                <DialogContent>
                    <div>
                        <Typography className={classes.header} variant="title">
                            {
                                allocationSolutionStore.solving &&
                                solverOptionsDisplay[allocationSolutionStore.solving.option]
                            }
                        </Typography>

                        <div className={classes.workersContainer}>
                            {
                                allocationSolutionStore.allocatingWorkers.map(this.renderWorkerDisplay)
                            }
                        </div>

                        {
                            allocationSolutionStore.solutionStatus === null &&
                            <div className={classes.progress}>
                                <SolverProgress
                                    time={
                                        allocationSolutionStore.solving
                                            ? allocationSolutionStore.solving.time
                                            : null
                                    }
                                />
                            </div>
                        }
                    </div>

                </DialogContent>

                <DialogActions>
                    {
                        allocationSolutionStore.solutionStatus !== null &&
                        <Button onClick={this.handleCloseLoader}>
                            {
                                allocationSolutionStore.solutionStatus
                                    ? `Solution found! (${allocationSolutionStore.objectiveValue})`
                                    : 'No solution'
                            }
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(AllocationLoader)
