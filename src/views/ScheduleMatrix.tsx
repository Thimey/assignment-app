import * as React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import Matrix from '../components/Matrix'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'

import { getTimes, renderTime } from '../lib/time'
import filterTasks from '../lib/filterTasks'
import { Task, Schedule, Time, ScheduledTask } from '../data'
import NewButton from '../components/NewButton'
import ScheduleList from '../components/ScheduleList'
import ScheduledTaskOverLay from '../components/ScheduledTaskOverlay'
import TaskScheduleDialog from '../components/TaskScheduleDialog'
import ScheduleTaskHeader from '../components/ScheduledTaskHeader'
import HeaderCell from '../components/HeaderCell'
import CornerMatrixFilter from '../components/CornerMatrixFilter'

import {
    SCHEDULE_CELL_WIDTH_PX,
    SCHEDULE_HEADER_CELL_HEIGHT_PX,
    SCHEDULE_CONTENT_CELL_HEIGHT_PX,
    SIDE_BAR_WIDTH_PX,
} from '../config'

import scheduleStore, { TimeTask } from '../stores/scheduleStore'
import taskStore from '../stores/taskStore'

import saveScheduleAction from '../actions/saveSchedule'
import deleteScheduledTask from '../actions/deleteScheduledTask'
import saveScheduleTask from '../actions/saveScheduleTask'

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

export interface State {
    selectedTaskIds : number[]
}

@observer
class ScheduleMatrix extends React.Component<Props, State> {
    @computed
    private get tasks() {
        return filterTasks(taskStore.tasks as any, scheduleStore.scheduleTaskFilter)
    }

    private get cells() : TimeTask[][] {
        const times = getTimes()

        return this.tasks
            .reduce((acc, task) => ([
                ...acc,
                times.map(time => ({ time, task })),
            ]), [])
    }

    private onScheduleSelect = (schedule : Schedule) => {
        scheduleStore.setSelectedScheduleId(schedule.id)
    }

    private handleCellClick = (timeTask : TimeTask) => () =>
        scheduleStore.setSelectedTimeTask(timeTask)

    private renderTask = (task : Task) => <ScheduleTaskHeader task={task} />

    private renderTime = (time : Time) => <HeaderCell text={renderTime(time)} />

    private renderOverlay = ({ task, scheduledTask } : { task : Task, scheduledTask : ScheduledTask }, width : number) =>
        <ScheduledTaskOverLay
            task={task}
            scheduledTask={scheduledTask}
            onDelete={deleteScheduledTask}
            width={width}
            view='worker'
        />

    private renderCell = (cellData : TimeTask) => (
        <div
            onClick={this.handleCellClick(cellData)}
            className={this.props.classes.cellContainer}
        />
    )

    private renderCorner = () => {
        return (
            <CornerMatrixFilter />
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
                                    rowHeaders={this.tasks as any}
                                    renderCell={this.renderCell}
                                    renderColHeader={this.renderTime}
                                    renderRowHeader={this.renderTask}
                                    renderCorner={this.renderCorner}
                                    cellWidthPx={SCHEDULE_CELL_WIDTH_PX}
                                    cellHeaderHeightPx={SCHEDULE_HEADER_CELL_HEIGHT_PX}
                                    cellContentHeightPx={SCHEDULE_CONTENT_CELL_HEIGHT_PX}
                                    cellOverlays={scheduleStore.getSelectedScheduledTasks(this.tasks)}
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
