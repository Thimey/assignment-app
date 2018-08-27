import * as React from 'react'
import Matrix from '../components/Matrix'

import getCost from '../lib/getCost'
import { Worker, Task } from '../data'
import {
    COST_MATRIX_CELL_WIDTH_PX,
    COST_MATRIX_HEADER_CELL_HEIGHT_PX,
    COST_MATRIX_CONTENT_CELL_HEIGHT_PX,
} from '../config'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'

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
                    cellWidthPx={COST_MATRIX_CELL_WIDTH_PX}
                    cellHeaderHeightPx={COST_MATRIX_HEADER_CELL_HEIGHT_PX}
                    cellContentHeightPx={COST_MATRIX_CONTENT_CELL_HEIGHT_PX}
                />
            </div>
        )
    }
}

export default withStyles(styles)(CostMatrix)
