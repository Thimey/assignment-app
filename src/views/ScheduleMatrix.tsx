import * as React from 'react'
import { observer } from 'mobx-react'
import Matrix from '../components/Matrix'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import { getTimes, renderTime } from '../lib/time'
import { Task, Schedule, Time, ScheduledTask } from '../data'
import NewSchedule from '../components/NewSchedule'
import ScheduleList from '../components/ScheduleList'
import ScheduledTaskOverLay from '../components/ScheduledTaskOverlay'
import TaskScheduleDialog from '../components/TaskScheduleDialog'

import {
    SCHEDULE_CELL_WIDTH_PX,
    SCHEDULE_HEADER_CELL_HEIGHT_PX,
    SCHEDULE_CONTENT_CELL_HEIGHT_PX,
} from '../config'

import scheduleStore, { TimeTask } from '../stores/scheduleStore'
import taskStore from '../stores/taskStore'

import saveScheduleAction from '../actions/saveSchedule'
import deleteScheduledTask from '../actions/deleteScheduledTask'
import saveScheduleTask from '../actions/saveScheduleTask'

const SIDE_BAR_WIDTH_PX = 200

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
    cellContainer: {
        height: '100%',
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#d4eff7',
        },
    }
})

export interface Props extends WithStyles<typeof styles> {}

@observer
class ScheduleMatrix extends React.Component<Props> {
    private get cells() : TimeTask[][] {
        const times = getTimes()

        return taskStore.tasks.reduce((acc, task) => ([
            ...acc,
            times.map(time => ({ time, task })),
        ]), [])
    }

    private onScheduleSelect = (schedule : Schedule) => {
        scheduleStore.setSelectedScheduleId(schedule.id)
    }

    private handleCellClick = (timeTask : TimeTask) => () =>
        scheduleStore.setSelectedTimeTask(timeTask)

        private renderTask = (task : Task) => <div>{task.name}</div>
        private renderTime = (time : Time) => <div>{renderTime(time)}</div>

    private renderOverlay = ({ task, scheduledTask } : { task : Task, scheduledTask : ScheduledTask }) =>
        <ScheduledTaskOverLay
            task={task}
            scheduledTask={scheduledTask}
            onDelete={deleteScheduledTask}
        />

    private renderCell = (cellData : TimeTask) => (
        <div
            onClick={this.handleCellClick(cellData)}
            className={this.props.classes.cellContainer}
        >

        </div>
    )

    private renderNullSchedule() {
        return (
            <Typography variant="display1">
                Select/create Schedule to start!
            </Typography>
        )
    }

    private handleCloseTaskToSchedule = () =>
        scheduleStore.setSelectedTimeTask(null)

    private handleSaveTaskToSchedule = (endTime : Time) => {
        saveScheduleTask(endTime)
        this.handleCloseTaskToSchedule()
    }

    public render() {
        const { classes } = this.props

        const schedules = scheduleStore.schedules
        const selectedSchedule = scheduleStore.selectedSchedule
        const selectedStartTime = scheduleStore.selectedTimeTask
            ? scheduleStore.selectedTimeTask.time
            : null

        return (
            <React.Fragment>
                <div className={classes.container}>

                    <div className={classes.sideContainer}>
                        <NewSchedule
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
                            !selectedSchedule
                                ? this.renderNullSchedule()
                                : <Matrix
                                    cells={this.cells}
                                    colHeaders={getTimes()}
                                    rowHeaders={taskStore.tasks as any}
                                    renderCell={this.renderCell}
                                    renderColHeader={this.renderTime}
                                    renderRowHeader={this.renderTask}
                                    cellWidthPx={SCHEDULE_CELL_WIDTH_PX}
                                    cellHeaderHeightPx={SCHEDULE_HEADER_CELL_HEIGHT_PX}
                                    cellContentHeightPx={SCHEDULE_CONTENT_CELL_HEIGHT_PX}
                                    cellOverlays={scheduleStore.selectedScheduledTasks}
                                    renderOverlay={this.renderOverlay}
                                />
                        }
                    </div>
                </div>

                <TaskScheduleDialog
                    startTime={selectedStartTime}
                    onSave={this.handleSaveTaskToSchedule}
                    onClose={this.handleCloseTaskToSchedule}
                />
            </React.Fragment>

        )
    }
}

export default withStyles(styles)(ScheduleMatrix)
