import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import WorkerAllocatedCard from '../components/WorkerAllocatedCard'
import WorkerAvatar from '../components/WorkerAvatar'
import { Worker } from '../data'

const styles = createStyles({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        height: '100%',
    },
    compactContainer: {
        marginRight: '4px',
    }
})

export interface Props extends WithStyles<typeof styles> {
    workers : Worker[]
    selectedWorkerIds : number[]
    onSelect : (worker : Worker) => void
    compact ?: boolean
}


class SelectWorkers extends React.Component<Props> {
    private isSelected(workerId : Worker['id']) {
        return this.props.selectedWorkerIds.indexOf(workerId) !== -1
    }

    private renderWorker = (worker : Worker) =>
        <WorkerAllocatedCard
            key={worker.id}
            worker={worker}
            onClick={this.props.onSelect}
            selected={this.isSelected(worker.id)}
        />

    private renderCompactWorker = (worker : Worker) =>
        <div
            key={worker.id}
            className={this.props.classes.compactContainer}
            onClick={() => this.props.onSelect(worker)}
        >
            <WorkerAvatar
                worker={worker}
                selected={this.isSelected(worker.id)}
            />
        </div>

    render () {
        const {
            classes,
            workers,
            compact,
        } = this.props

        return (
            <div className={classes.container}>
                {
                    compact
                        ? workers.map(this.renderCompactWorker)
                        : workers.map(this.renderWorker)
                }
            </div>
        )
    }
}

export default withStyles(styles)(SelectWorkers)
