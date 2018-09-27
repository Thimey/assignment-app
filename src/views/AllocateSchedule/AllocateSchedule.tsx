import * as React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { differenceWith, uniq } from 'ramda'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { Worker } from '../../data'
import { SolveOption } from '../../solver'
import SelectWorkers from '../../components/SelectWorkers'
import ModelSidebar from '../../components/ModelSidebar'

import { filterWorkers } from '../../lib/filterWorkers'
import allocate from '../../actions/allocate'

import scheduleStore from '../../stores/scheduleStore'
import workerStore from '../../stores/workerStore'
import modelStore from '../../stores/modelStore'

import CostMatrix from '../CostMatrix'

import SolverOptions from './SolverOptions'
import Constraints from './Constraints'

const styles = createStyles({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        justifyContent: 'center',
    },
    stepperContainer: {

    },
    rollCall: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'scroll',
    },
    actionsContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '85px',
    },
    selectWorkers: {
        height: 'calc(100% - 85px)',
        overflow: 'scroll',
    },
    filter: {
        marginRight: '16px',
        marginLeft: '8px',
        maxWidth: '600px',
    },
    selectAll: {
        marginRight: '8px',
        width: '180px',
    },
    paper: {
        paddingLeft: '4px',
        paddingRight: '4px',
    }
})

export interface Props extends WithStyles<typeof styles> {}

export interface State {
    open : boolean
    filter : string
    activeStep : number
}

@observer
export class AllocateSchedule extends React.Component<Props, State> {
    state : State = {
        open: false,
        filter: '',
        activeStep: 0,
    }

    private setStep = (step : number) => this.setState({
        activeStep: step,
    })

    private handleFilterChange = (e : any) => {
        this.setState({
            filter: e.target.value,
        })
    }

    private get filteredWorkers() {
        return filterWorkers(workerStore.workers, this.state.filter)
    }

    private handleOpen = () => this.setState({
        open: true,
    })

    private handleClose = () => this.setState({
        open: false,
        activeStep: 0,
    })

    @computed
    private get allSelected() {
        return !differenceWith(
            ({ id }, id2) => id === id2,
            this.filteredWorkers,
            modelStore.selectedWorkerIds
        ).length
    }

    private handleSelectOrDeSelectAll = () => {
        const newSelectedWorkerIds = this.allSelected
            ? modelStore.selectedWorkerIds.filter(id => !this.filteredWorkers.find(w => w.id === id))
            : uniq([
                ...modelStore.selectedWorkerIds,
                ...this.filteredWorkers.map(({ id }) => id),
            ])

        modelStore.setSelectedWorkerIds(newSelectedWorkerIds)
    }

    private handleWorkerSelectedOrDeselected = (worker : Worker) => {
        const newSelectedWorkerIds = modelStore.selectedWorkerIds.indexOf(worker.id) < 0
            ? [...modelStore.selectedWorkerIds, worker.id]
            : modelStore.selectedWorkerIds.filter(workerId => worker.id !== workerId)

        modelStore.setSelectedWorkerIds(newSelectedWorkerIds)
    }

    private handleAllocate = () => {
        if (modelStore.canAllocate) {
            this.handleClose()

            allocate({
                schedule: scheduleStore.selectedSchedule!,
                selectedWorkerIds: modelStore.selectedWorkerIds,
                solverOption: modelStore.selectedSolution,
                time: modelStore.timeLimit,
            })
        }
    }

    private handleSolutionOptionSelect = (option : SolveOption) => {
        modelStore.setSolverOption(option)
        modelStore.setTimeLimit(null)
    }

    private handleTimeLimitChange = (timeLimit : number) => {
        modelStore.setTimeLimit(timeLimit)
    }

    private get steps() {
        const { classes } = this.props

        return [
            {
                label: 'Solver options',
                comp: (
                    <SolverOptions
                        selectedSolution={modelStore.selectedSolution}
                        onSolutionOptionSelect={this.handleSolutionOptionSelect}
                        timeLimit={modelStore.timeLimit}
                        onTimeLimitChange={this.handleTimeLimitChange}

                    />)
            },
            {
                label: 'Roll call',
                comp: (
                    <div className={classes.rollCall}>
                        <div className={classes.actionsContainer}>
                            <TextField
                                fullWidth
                                className={classes.filter}
                                value={this.state.filter}
                                onChange={this.handleFilterChange}
                                placeholder="search name or tags"
                            />
                            <Button
                                className={classes.selectAll}
                                variant="raised"
                                color="secondary"
                                onClick={this.handleSelectOrDeSelectAll}
                            >
                                {
                                    this.allSelected
                                        ? 'DeSelect all'
                                        : 'Select all'
                                }
                            </Button>
                        </div>

                        <div className={classes.selectWorkers}>
                            <SelectWorkers
                                selectedWorkerIds={modelStore.selectedWorkerIds}
                                workers={this.filteredWorkers}
                                onSelect={this.handleWorkerSelectedOrDeselected}
                            />
                        </div>
                    </div>
                )
            },
            {
                label: 'Constraints',
                comp: <Constraints />
            },
            {
                label: 'Cost matrix',
                comp: <CostMatrix />,
                disabled: modelStore.selectedSolution === SolveOption.noOptimisation,
            },
        ]
    }

    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                <Button color="secondary" onClick={this.handleOpen}>
                    Model
                </Button>

                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose}
                    classes={{
                        paper: classes.paper,
                    }}
                >
                    <DialogTitle disableTypography>
                        <div className={classes.headerContainer}>
                            <Typography variant="display2">
                                Assignment model
                            </Typography>
                        </div>

                    </DialogTitle>

                    <ModelSidebar
                        onLabelClick={this.setStep}
                        activeStep={this.state.activeStep}
                        steps={this.steps}
                    />

                    <DialogActions>
                        <Button onClick={this.handleClose}>
                            Close
                        </Button>

                        <Button
                            variant="raised"
                            color="secondary"
                            onClick={this.handleAllocate}
                            disabled={!modelStore.canAllocate}
                        >
                            Allocate
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(AllocateSchedule)