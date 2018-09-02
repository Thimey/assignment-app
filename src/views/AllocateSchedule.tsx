import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'

import { Worker } from '../data'
import SelectWorkers from '../components/SelectWorkers'
import scheduleStore from '../stores/scheduleStore'
import workerStore from '../stores/workerStore'
import allocate from '../actions/allocate'

const styles = createStyles({
    container: {
        height: '80%',
        width: '80%',
    }
})

export interface Props extends WithStyles<typeof styles> {}

export interface State {
    open : boolean
    selectedWorkerIds : number[]
}

@observer
export class AllocateSchedule extends React.Component<Props, State> {
    state : State = { selectedWorkerIds: [], open: false }

    private handleOpen = () => this.setState({ open: true })
    private handleClose = () => this.setState({
        open: false,
        selectedWorkerIds: [],
    })

    private get allSelected() {
        return this.state.selectedWorkerIds.length === workerStore.workers.length
    }

    private handleSelectOrDeSelectAll = () => {
        const newSelectedWorkerIds = this.allSelected
            ? []
            : workerStore.workers.map(({ id }) => id)

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

    private handleAllocate = async () => {
        if (this.canAllocate) {
            await allocate(scheduleStore.selectedSchedule!, this.state.selectedWorkerIds)
        }
        this.handleClose()
    }

    render() {
        return (
            <React.Fragment>
                <Button onClick={this.handleOpen}>
                    Allocate
                </Button>

                <Dialog
                    fullScreen
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>
                        Roll call

                        <Button onClick={this.handleSelectOrDeSelectAll}>
                            {
                                this.allSelected
                                    ? 'DeSelect all'
                                    : 'Select all'
                            }
                        </Button>
                    </DialogTitle>

                    <DialogContent>
                        <SelectWorkers
                            selectedWorkerIds={this.state.selectedWorkerIds}
                            workers={workerStore.workers}
                            onSelect={this.handleWorkerSelectedOrDeselected}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="raised"
                            onClick={this.handleAllocate}
                            disabled={!this.canAllocate}
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