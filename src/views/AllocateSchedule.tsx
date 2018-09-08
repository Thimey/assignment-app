import * as React from 'react'
// import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { differenceWith, any, uniq } from 'ramda'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

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
    filter : string
    selectedWorkerIds : number[]
}

@observer
export class AllocateSchedule extends React.Component<Props, State> {
    state : State = {
        selectedWorkerIds: [],
        open: false,
        filter: '',
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

        console.log('this.filteredWorkers', this.filteredWorkers)
        console.log(newSelectedWorkerIds)

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
                        <TextField
                            value={this.state.filter}
                            onChange={this.handleFilterChange}
                        />
                        <SelectWorkers
                            selectedWorkerIds={this.state.selectedWorkerIds}
                            workers={this.filteredWorkers}
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