import * as React from 'react'
// import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { differenceWith, any, uniq } from 'ramda'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'

import { Worker } from '../../data'
import SelectWorkers from '../../components/SelectWorkers'
import AllocateStepper from '../../components/AllocateStepper'

import scheduleStore from '../../stores/scheduleStore'
import workerStore from '../../stores/workerStore'
import { SolveOption } from '../../stores/allocationSolutionStore'
import allocate from '../../actions/allocate'
import CostMatrix from '../CostMatrix'

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
    actionsContainer: {
        marginLeft: '8px',
    },
    filter: {
        marginLeft: '8px',
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
        return workerStore.workers
            .filter(worker =>
                worker.name.includes(this.state.filter) ||
                any(tag => tag.includes(this.state.filter), worker.tags)
            )
    }

    private handleOpen = () => this.setState({ open: true })
    private handleClose = () => this.setState({
        open: false,
        selectedWorkerIds: [],
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

    private handleSolutionOptionSelect = (e : any) => {
        this.setState({
            selectedSolution: e.target.value,
            timeLimit: e.target.value !== SolveOption.optimise
                ? null
                : DEFAULT_TIME_LIMIT_MINS
        })
    }

    private handleTimeLimitChange = (e : any) => {
        this.setState({
            timeLimit: parseInt(e.target.value, 10),
        })
    }

    private get steps() {
        return [
            {
                label: 'Solver options',
                comp: (
                    <div>
                        <Select
                            value={this.state.selectedSolution}
                            onChange={this.handleSolutionOptionSelect}
                        >
                            <MenuItem value={SolveOption.noOptimisation}>No optimisation</MenuItem>
                            <MenuItem value={SolveOption.optimise}>Giv me a lil optimisation</MenuItem>
                            <MenuItem value={SolveOption.optimal}>Optimal!</MenuItem>
                        </Select>

                        {
                            this.state.timeLimit !== null &&
                            <TextField
                                type="number"
                                inputProps={{
                                    min: 1,
                                }}
                                onChange={this.handleTimeLimitChange}
                                value={this.state.timeLimit}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">mins</InputAdornment>,
                                }}
                            />
                        }
                    </div>
                )
            },
            {
                label: 'Roll call',
                comp: (
                    <SelectWorkers
                        selectedWorkerIds={this.state.selectedWorkerIds}
                        workers={this.filteredWorkers}
                        onSelect={this.handleWorkerSelectedOrDeselected}
                    />
                )
            },
            {
                label: 'Constraints',
                comp: (
                    <div>
                        Constraints
                    </div>
                )
            },
            {
                label: 'Cost matrix',
                comp: <CostMatrix />,
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

                            <div className={classes.actionsContainer}>
                                <Button
                                    color="primary"
                                    onClick={this.handleSelectOrDeSelectAll}
                                >
                                    {
                                        this.allSelected
                                            ? 'DeSelect all'
                                            : 'Select all'
                                    }
                                </Button>
                                <TextField
                                    className={classes.filter}
                                    value={this.state.filter}
                                    onChange={this.handleFilterChange}
                                    placeholder="search name or tags"
                                />
                            </div>
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