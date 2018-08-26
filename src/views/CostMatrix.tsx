import * as React from 'react'
import Matrix from '../components/Matrix'

import getCost from '../lib/getCost'
import { Worker, Task } from '../data'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'

export const CELL_WIDTH_PX = 100
export const HEADER_CELL_HEIGHT_PX = 50
export const CONTENT_CELL_HEIGHT_PX = 100


const styles = createStyles({
    container: {
        height: '80%',
        width: '80%',
    }
})

export interface Props extends WithStyles<typeof styles> {
    workers : Worker[]
    tasks : Task[]
}

class CostMatrix extends React.Component<Props> {
    private get cells() {
        const { workers, tasks } = this.props

        return workers.reduce((acc, worker) => ([
            ...acc,
            tasks.reduce((acc, task) => ([
                ...acc,
                getCost(worker, task)
            ]), [])
        ]), [])
    }

    private renderCost = (cost : number) => <div>{cost}</div>
    private renderTask = (task : Task) => <div>{task.name}</div>
    private renderWorker = (worker : Worker) => <div>{worker.name}</div>

    public render() {
        const { workers, tasks } = this.props

        return (
            <div className={this.props.classes.container}>
                <Matrix
                    cells={this.cells}
                    colHeaders={tasks}
                    rowHeaders={workers}
                    renderCell={this.renderCost}
                    renderColHeader={this.renderTask}
                    renderRowHeader={this.renderWorker}
                    cellWidthPx={CELL_WIDTH_PX}
                    cellHeaderHeightPx={HEADER_CELL_HEIGHT_PX}
                    cellContentHeightPx={CONTENT_CELL_HEIGHT_PX}
                />
            </div>
        )
    }
}

export default withStyles(styles)(CostMatrix)
