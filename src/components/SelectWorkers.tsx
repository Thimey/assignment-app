import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import WorkerAllocatedCard from '../components/WorkerAllocatedCard'
import { Worker } from '../data'

const styles = createStyles({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
})

export interface Props extends WithStyles<typeof styles> {
    workers : Worker[]
    selectedWorkerIds : number[]
    onSelect : (worker : Worker) => void
}


class SelectWorkers extends React.Component<Props> {
    private renderWorker = (worker : Worker) =>
        <WorkerAllocatedCard
            key={worker.id}
            worker={worker}
            onClick={this.props.onSelect}
            selected={this.props.selectedWorkerIds.indexOf(worker.id) !== -1}
        />

    render () {
        const {
            classes,
            workers,
        } = this.props

        return (
            <div className={classes.container}>
                {
                    workers.map(this.renderWorker)
                }
            </div>
        )
    }
}

export default withStyles(styles)(SelectWorkers)
