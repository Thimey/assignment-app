import * as React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'

import Matrix from '../components/Matrix'

import { Worker, Task, SavedCostMatrix } from '../data'

import {
    COST_MATRIX_CELL_WIDTH_PX,
    COST_MATRIX_HEADER_CELL_HEIGHT_PX,
    COST_MATRIX_CONTENT_CELL_HEIGHT_PX,
    SIDE_BAR_WIDTH_PX,
} from '../config'

import filterTasks from '../lib/filterTasks'
import filterWorkers from '../lib/filterWorkers'

import workerStore from '../stores/workerStore'
import taskStore from '../stores/taskStore'
import costStore from '../stores/costStore'

import CostCell from '../components/CostCell'
import NewButton from '../components/NewButton'
import CostMatrixList from '../components/CostMatrixList'
import WorkerCostCard from '../components/WorkerCard'
import HeaderCell from '../components/HeaderCell'
import CornerMatrixFilter from '../components/CornerMatrixFilter'

import saveCostMatrix from '../actions/saveCostMatrix'
import updateCurrentCostMatrix from '../actions/updateCurrentCostMatrix'


const styles = createStyles({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
    },
    sideContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: SIDE_BAR_WIDTH_PX,
        paddingRight: 10,
    },
    matrixContainer: {
        width: `calc(100% - ${SIDE_BAR_WIDTH_PX}px)`,
    },
})

export interface Props extends WithStyles<typeof styles> {}

@observer
class CostMatrix extends React.Component<Props> {
    @computed
    private get tasks() {
        return filterTasks(taskStore.tasks as any, costStore.matrixTaskFilter)
    }

    @computed
    private get workers() {
        return filterWorkers(workerStore.workers as any, costStore.matrixWorkerFilter)
    }

    private get cells() {
        return this.workers.reduce((acc, worker) => ([
            ...acc,
            this.tasks.reduce((acc, task) => ([
                ...acc,
                { worker, task }
            ]), [])
        ]), [])
    }


    private renderTask = (task : Task) => <HeaderCell text={task.name} />
    private renderWorker = (worker : Worker) => <WorkerCostCard worker={worker} />

    private renderCost = ({ worker, task } : { worker : Worker, task : Task}) =>
        <CostCell
            worker={worker}
            task={task}
        />

    private handleTaskFilterChange = (filter : string) => {
        costStore.onTaskFilter(filter)
    }

    private handleWorkerFilterChange = (filter : string) => {
        costStore.onWorkerFilter(filter)
    }

    private restoreDefault = () => {
        // Restore the current costMatrix
        costStore.restoreDefault()

        updateCurrentCostMatrix()
    }

    private saveCostMatrix = (nameObj : { name : string }) => {
        saveCostMatrix({
            ...nameObj,
            costMatrix: {
                ...costStore.currentCostMatrix
            },
        })
    }

    private handleCostMatrixListClick = (savedCostMatrixId : SavedCostMatrix['id']) => {
        costStore.loadCostMatrix(savedCostMatrixId)
    }

    public render() {
        const { classes } = this.props

        return (
            <div className={classes.container}>
                <div className={classes.matrixContainer}>
                    <Matrix
                        cells={this.cells}
                        colHeaders={this.tasks as Task[]}
                        rowHeaders={this.workers as Worker[]}
                        renderCell={this.renderCost}
                        renderColHeader={this.renderTask}
                        renderCorner={<CornerMatrixFilter
                            onTaskChange={this.handleTaskFilterChange}
                            onWorkerChange={this.handleWorkerFilterChange}
                            workerFilter={costStore.matrixWorkerFilter}
                            taskFilter={costStore.matrixTaskFilter}
                        />}
                        renderRowHeader={this.renderWorker}
                        cellWidthPx={COST_MATRIX_CELL_WIDTH_PX}
                        cellHeaderHeightPx={COST_MATRIX_HEADER_CELL_HEIGHT_PX}
                        cellContentHeightPx={COST_MATRIX_CONTENT_CELL_HEIGHT_PX}
                    />
                </div>

                <div className={classes.sideContainer}>
                    <NewButton
                        title="Save costs"
                        onSave={this.saveCostMatrix}
                    />

                    <Button color="secondary" variant="flat" onClick={this.restoreDefault}>
                        Restore defaults
                    </Button>

                    <CostMatrixList
                        selectedScheduleId={costStore.selectedCostMatrixId}
                        costMatrices={costStore.savedMatrices}
                        onCostMatrixClick={this.handleCostMatrixListClick}
                    />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(CostMatrix)
