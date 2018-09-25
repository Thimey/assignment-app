import * as React from 'react'
import { observer } from 'mobx-react'
import Matrix from '../components/Matrix'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'

import { getTimes, renderTime } from '../lib/time'
import { Schedule, Time, ScheduledTask, Worker } from '../data'
import NewButton from '../components/NewButton'
import ScheduleList from '../components/ScheduleList'
import ScheduledTaskOverLay from '../components/ScheduledTaskOverlay'
import HeaderCell from '../components/HeaderCell'

import {
    SCHEDULE_CELL_WIDTH_PX,
    SCHEDULE_HEADER_CELL_HEIGHT_PX,
    SCHEDULE_CONTENT_CELL_HEIGHT_PX,
    SIDE_BAR_WIDTH_PX,
} from '../config'

import WorkerCard from '../components/WorkerCard'

import scheduleStore, { TimeWorker } from '../stores/scheduleStore'
import allocationSolutionStore from '../stores/allocationSolutionStore'
import workerStore from '../stores/workerStore'
import taskStore from '../stores/taskStore'

import saveScheduleAction from '../actions/saveSchedule'
import deleteScheduledTask from '../actions/deleteScheduledTask'

const styles = (theme : Theme) => createStyles({
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `calc(100% - ${SIDE_BAR_WIDTH_PX}px)`,
    },
    cellContainer: {
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.grey["50"],
        },
    },
})

export interface Props extends WithStyles<typeof styles> {}

@observer
class AllocatedWorkerMatrix extends React.Component<Props> {
    private get cells() : TimeWorker[][] {
        const times = getTimes()

        return workerStore.workers.reduce((acc, worker) => ([
            ...acc,
            times.map(time => ({ time, worker })),
        ]), [])
    }

    private onScheduleSelect = (schedule : Schedule) => {
        scheduleStore.setSelectedScheduleId(schedule.id)
    }

    private renderWorker = (worker : Worker) => <WorkerCard worker={worker} />

    private renderTime = (time : Time) => <HeaderCell text={renderTime(time)} />

    private renderOverlay = ({ scheduledTask, worker } : { worker : Worker, scheduledTask : ScheduledTask }, width : number) =>
        <ScheduledTaskOverLay
            task={taskStore.getTask(scheduledTask.taskId)!}
            scheduledTask={scheduledTask}
            onDelete={deleteScheduledTask}
            width={width}
            worker={worker}
            view='task'
        />

    private renderCell = (_cellData : TimeWorker) => (
        <div
            className={this.props.classes.cellContainer}
        />
    )

    private renderCorner = () => {
        return <div></div>
    }

    public render() {
        const { classes } = this.props

        const schedules = scheduleStore.schedules
        const selectedSchedule = scheduleStore.selectedSchedule

        return (
            <div className={classes.container}>

                <div className={classes.sideContainer}>
                    <NewButton
                        title="New Schedule"
                        onSave={saveScheduleAction}
                    />

                    <Divider />

                    <ScheduleList
                        schedules={schedules}
                        onScheduleClick={this.onScheduleSelect}
                        selectedScheduleId={selectedSchedule ? selectedSchedule.id : null}
                    />
                </div>

                <div className={classes.matrixContainer}>
                    {
                        selectedSchedule &&
                            <Matrix
                                cells={this.cells}
                                colHeaders={getTimes()}
                                rowHeaders={workerStore.workers as any}
                                renderCell={this.renderCell}
                                renderColHeader={this.renderTime}
                                renderRowHeader={this.renderWorker}
                                renderCorner={this.renderCorner}
                                cellWidthPx={SCHEDULE_CELL_WIDTH_PX}
                                cellHeaderHeightPx={SCHEDULE_HEADER_CELL_HEIGHT_PX}
                                cellContentHeightPx={SCHEDULE_CONTENT_CELL_HEIGHT_PX}
                                cellOverlays={allocationSolutionStore.allocatedScheduledTasks}
                                renderOverlay={this.renderOverlay}
                            />
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(AllocatedWorkerMatrix)
