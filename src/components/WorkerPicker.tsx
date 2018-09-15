import * as React from 'react'
import { differenceWith, uniq } from 'ramda'


import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import DoneAllIcon from '@material-ui/icons/DoneAll'

import { Worker } from '../data'
import { filterWorkers } from '../lib/filterWorkers'
import workerStore from '../stores/workerStore'

import SelectWorkers from './SelectWorkers'
import WorkerAvatar from './WorkerAvatar'

const styles = createStyles({
    displayContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '250px',
    },
    displayAvatarContainer: {
        marginRight: '4px',
    },
    filterContainer: {
        display: 'flex',
        marginBottom: '16px',
        width: '100%',
    },
    paper: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '400px',
    },
    selectAll: {
        marginLeft: '8px',
    }
})

export interface Props extends WithStyles<typeof styles> {
    selectedWorkerIds : number[]
    onSelect : (newWorkerIds : Worker['id'][]) => void
}

export interface State {
    open : boolean
    filter : string
}

class WorkerPicker extends React.Component<Props, State> {
    state : State = { open: false, filter: '' }

    private anchorEl : HTMLElement | null = null

    private handleOpen = () => this.setState({ open: true, filter: '' })
    private handleClose = () => this.setState({ open: false })

    private handleSelectOrDeSelectAll = () => {
        const { selectedWorkerIds } = this.props

        const newWorkerIds = this.allSelected
            ? selectedWorkerIds.filter(id => !this.filteredWorkers.find(w => w.id === id))
            : uniq([
                ...selectedWorkerIds,
                ...this.filteredWorkers.map(({ id }) => id),
            ])

        this.props.onSelect(newWorkerIds)
    }

    private handleWorkerSelect = (worker : Worker) => {
        const { selectedWorkerIds } = this.props

        const newWorkerIds = selectedWorkerIds.indexOf(worker.id) > -1
            ? selectedWorkerIds.filter(id => worker.id !== worker.id)
            : [...selectedWorkerIds, worker.id]

        this.props.onSelect(newWorkerIds)
    }

    private handleFilterChange = (e : any) => {
        this.setState({
            filter: e.target.value,
        })
    }

    private get allSelected() {
        return !differenceWith(
            ({id}, id2) => id === id2,
            this.filteredWorkers,
            this.props.selectedWorkerIds
        ).length
    }

    private get filteredWorkers() {
        return filterWorkers(workerStore.workers, this.state.filter)
    }

    private renderDisplay() {
        return <div className={this.props.classes.displayContainer}>
            {
                this.props.selectedWorkerIds.map((id) => {
                    const worker = workerStore.getWorker(id)

                    if (worker) {
                        return (
                            <div className={this.props.classes.displayAvatarContainer}>
                                <WorkerAvatar worker={worker} />
                            </div>
                        )
                    }

                    return null
                })
            }
        </div>
    }

    private assignAnchorEl = (node : HTMLElement | null) => {
        this.anchorEl = node
    }

    render () {
        const {
            classes,
            selectedWorkerIds,
        } = this.props

        return (
            <React.Fragment>
                <div
                    ref={this.assignAnchorEl}
                    className={classes.displayContainer}
                    onClick={this.handleOpen}
                >
                    {
                        this.renderDisplay()
                    }
                </div>

                <Popover
                    anchorEl={this.anchorEl}
                    onClose={this.handleClose}
                    open={this.state.open}
                    classes={{
                        paper: classes.paper
                    }}
                >

                    <div className={classes.filterContainer}>
                        <TextField
                            placeholder="search"
                            value={this.state.filter}
                            onChange={this.handleFilterChange}
                            fullWidth
                        />

                        <Button
                            className={classes.selectAll}
                            variant="flat"
                            color="secondary"
                            onClick={this.handleSelectOrDeSelectAll}
                        >
                            <DoneAllIcon />
                        </Button>
                    </div>

                    <SelectWorkers
                        workers={this.filteredWorkers}
                        selectedWorkerIds={selectedWorkerIds}
                        onSelect={this.handleWorkerSelect}
                        compact
                    />
                </Popover>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(WorkerPicker)
