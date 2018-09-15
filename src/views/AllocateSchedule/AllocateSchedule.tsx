import * as React from 'react'
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
import SelectWorkers from '../../components/SelectWorkers'
import AllocateStepper from '../../components/AllocateStepper'

import { filterWorkers } from '../../lib/filterWorkers'

import scheduleStore from '../../stores/scheduleStore'
import workerStore from '../../stores/workerStore'
import { SolveOption } from '../../stores/allocationSolutionStore'
import allocate from '../../actions/allocate'
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
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    filter: {
        marginRight: '16px',
        marginLeft: '8px',
        maxWidth: '600px',
    },
    selectAll: {
        marginRight: '8px',
        width: '180px',
    }
})

const DEFAULT_TIME_LIMIT_MINS = 3

export interface Props extends WithStyles<typeof styles> {}

export interface State {
    open : boolean
    filter : string
    selectedWorkerIds : number[]
    selectedSolution : SolveOption
    timeLimit : number | null
    activeStep : number
}

// TODO: no work constraint, has to work constraint, consecutive, total

@observer
export class AllocateSchedule extends React.Component<Props, State> {
    state : State = {
        selectedWorkerIds: [],
        open: false,
        filter: '',
        selectedSolution: SolveOption.noOptimisation,
        timeLimit: null,
        activeStep: 0,
    }

    private setStep = (step : number) => this.setState({
        activeStep: step,
    })

    private handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }))
    }

    private handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }))
    }

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
        selectedWorkerIds: [],
        activeStep: 0,
    })

    private get allSelected() {
        return !differenceWith(
            ({id}, id2) => id === id2,
            this.filteredWorkers,
            this.state.selectedWorkerIds
        ).length
    }

    private handleSelectOrDeSelectAll = () => {
        const newSelectedWorkerIds = this.allSelected
            ? this.state.selectedWorkerIds.filter(id => !this.filteredWorkers.find(w => w.id === id))
            : uniq([
                ...this.state.selectedWorkerIds,
                ...this.filteredWorkers.map(({ id }) => id),
            ])

        this.setState({
            selectedWorkerIds: newSelectedWorkerIds
        })
    }

    private handleWorkerSelectedOrDeselected = (worker : Worker) => {
        const newSelectedWorkerIds = this.state.selectedWorkerIds.indexOf(worker.id) < 0
            ? [...this.state.selectedWorkerIds, worker.id]
            : this.state.selectedWorkerIds.filter(workerId => worker.id !== workerId)

        this.setState({
            selectedWorkerIds: newSelectedWorkerIds
        })
    }

    private get canAllocate() {
        return scheduleStore.selectedSchedule && this.state.selectedWorkerIds.length
    }

    private handleAllocate = () => {
        if (this.canAllocate) {
            this.handleClose()

            allocate({
                schedule: scheduleStore.selectedSchedule!,
                selectedWorkerIds: this.state.selectedWorkerIds,
                solverOption: this.state.selectedSolution,
                time: this.state.timeLimit,
            })
        }
    }

    private handleSolutionOptionSelect = (option : SolveOption) => {
        this.setState({
            selectedSolution: option,
            timeLimit: option !== SolveOption.optimise
                ? null
                : DEFAULT_TIME_LIMIT_MINS
        })
    }

    private handleTimeLimitChange = (timeLimit : number) => {
        this.setState({
            timeLimit,
        })
    }

    private get steps() {
        const { classes } = this.props

        return [
            {
                label: 'Solver options',
                comp: (
                    <SolverOptions
                        selectedSolution={this.state.selectedSolution}
                        onSolutionOptionSelect={this.handleSolutionOptionSelect}
                        timeLimit={this.state.timeLimit}
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
                        <SelectWorkers
                            selectedWorkerIds={this.state.selectedWorkerIds}
                            workers={this.filteredWorkers}
                            onSelect={this.handleWorkerSelectedOrDeselected}
                        />
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
                disabled: true,
            },
        ]
    }

    private renderActionControls() {
        const { activeStep } = this.state

        if (this.state.activeStep !== this.steps.length) {
            return (
                <div>
                    <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                    >
                        {activeStep === this.steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            )
        }

        return (
            <Button
                variant="raised"
                color="secondary"
                onClick={this.handleAllocate}
                disabled={!this.canAllocate}
            >
                Allocate
            </Button>
        )
    }

    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                <Button color="secondary" onClick={this.handleOpen}>
                    Allocate
                </Button>

                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle disableTypography>
                        <div className={classes.headerContainer}>
                            <Typography variant="title">
                                Assignment model
                            </Typography>
                        </div>

                    </DialogTitle>

                    <AllocateStepper
                        onLabelClick={this.setStep}
                        activeStep={this.state.activeStep}
                        steps={this.steps}
                    />

                    <DialogActions>
                        {
                            this.renderActionControls()
                        }

                        <Button onClick={this.handleClose}>
                            Cancel
                        </Button>

                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(AllocateSchedule)