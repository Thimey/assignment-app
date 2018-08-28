import * as React from 'react'
import Matrix, { Overlay } from '../components/Matrix'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'

import { getTimes, renderTime, getTimeOverlayPx } from '../lib/time'
import { Task, Schedule, Time } from '../data'
import NewSchedule from '../components/NewSchedule'
import ScheduleList from '../components/ScheduleList'

import {
    SCHEDULE_CELL_WIDTH_PX,
    SCHEDULE_HEADER_CELL_HEIGHT_PX,
    SCHEDULE_CONTENT_CELL_HEIGHT_PX,
} from '../config'

const SIDE_BAR_WIDTH_PX = 200

const styles = createStyles({
    container: {
        display: 'flex',
        height: '80%',
        width: '80%',
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

export interface ScheduleData {
    time : Time
    task : Task
}

export interface Props extends WithStyles<typeof styles> {
    schedules : Schedule[]
    selectedScheduleId : number | null
    onScheduleSelect : (schedule : Schedule) => void
    tasks : Task[]
    saveSchedule : (schedule : Schedule) => void
    onCellClick : (cellData : ScheduleData) => void
}

export interface State {
    displaySchedule : Schedule | null
}

class ScheduleMatrix extends React.Component<Props, State> {
    state = { displaySchedule: null }

    private getTaskSchedules() {
        const { tasks, selectedScheduleId, schedules } = this.props

        const selectedSchedule = selectedScheduleId === null
            ? null
            : schedules.find(s => s.id === selectedScheduleId)


        if (!selectedSchedule) {
            return []
        }

        return tasks.reduce((acc, task) => ([
            ...acc,
            selectedSchedule.tasks
                .filter(schTask => schTask.taskId === task.id )
                .map(schTask => ({
                    ...getTimeOverlayPx(schTask),
                    data: task,
                })),
        ]), [])
    }

    private get cells() : ScheduleData[][] {
        const { tasks } = this.props
        const times = getTimes()

        return tasks.reduce((acc, task) => ([
            ...acc,
            times.map(time => ({ time, task })),
        ]), [])
    }

    private handleCellClick = (cellData : ScheduleData) => () =>
        this.props.onCellClick(cellData)

    private renderOverlay = ({ data } : Overlay) => <div>asd</div>
    private renderTask = (task : Task) => <div>{task.name}</div>
    private renderTime = (time : Time) => <div>{renderTime(time)}</div>

    private renderCell = (cellData : ScheduleData) => (
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

    public render() {
        const {
            tasks,
            classes,
            saveSchedule,
            selectedScheduleId,
            schedules,
            onScheduleSelect,
        } = this.props

        return (
            <div className={classes.container}>

                <div className={classes.sideContainer}>
                    <NewSchedule
                        onSave={saveSchedule}
                    />

                    <Divider />

                    <ScheduleList
                        schedules={schedules}
                        onScheduleClick={onScheduleSelect}
                        selectedScheduleId={selectedScheduleId}
                    />
                </div>

                <div className={classes.matrixContainer}>
                    {
                        selectedScheduleId === null
                            ? this.renderNullSchedule()
                            : <Matrix
                                cells={this.cells}
                                colHeaders={getTimes()}
                                rowHeaders={tasks}
                                renderCell={this.renderCell}
                                renderColHeader={this.renderTime}
                                renderRowHeader={this.renderTask}
                                cellWidthPx={SCHEDULE_CELL_WIDTH_PX}
                                cellHeaderHeightPx={SCHEDULE_HEADER_CELL_HEIGHT_PX}
                                cellContentHeightPx={SCHEDULE_CONTENT_CELL_HEIGHT_PX}
                                cellOverlays={this.getTaskSchedules()}
                                renderOverlay={this.renderOverlay}
                            />
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ScheduleMatrix)
