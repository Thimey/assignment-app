import * as React from 'react'
import Matrix, { Overlay } from '../components/Matrix'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'

import { getTimes } from '../lib/time'
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
})

export interface Props extends WithStyles<typeof styles> {
    schedules : Schedule[]
    tasks : Task[]
    saveSchedule : (schedule : Schedule) => void
}

export interface State {
    displaySchedule : Schedule | null
}

class ScheduleMatrix extends React.Component<Props, State> {
    state = { displaySchedule: null }

    private get taskSchedules() {
        return [
            [
                {
                    data: 'some data',
                    startPx: 600,
                    withPx: 400,
                } as Overlay
            ]
        ]
    }

    private get cells() {
        const { tasks } = this.props
        const times = getTimes()

        return tasks.reduce((acc, _task) => ([
            ...acc,
            [...times],
        ]), [])
    }

    private renderOverlay = ({ data } : Overlay) => <div>{data}</div>
    private renderBlank = (cost : number) => <div></div>
    private renderTask = (task : Task) => <div>{task.name}</div>
    private renderTime = (time : Time) => <div>{`${time.hour} : ${time.min}`}</div>

    public render() {
        const { tasks, classes, saveSchedule } = this.props

        return (
            <div className={classes.container}>

                <div className={classes.sideContainer}>
                    <NewSchedule
                        onSave={saveSchedule}
                    />

                    <Divider />

                    <ScheduleList
                        schedules={this.props.schedules}
                        onScheduleClick={(s : any) => console.log(s)}
                    />
                </div>

                <div className={classes.matrixContainer}>
                    <Matrix
                        cells={this.cells}
                        colHeaders={getTimes()}
                        rowHeaders={tasks}
                        renderCell={this.renderBlank}
                        renderColHeader={this.renderTime}
                        renderRowHeader={this.renderTask}
                        cellWidthPx={SCHEDULE_CELL_WIDTH_PX}
                        cellHeaderHeightPx={SCHEDULE_HEADER_CELL_HEIGHT_PX}
                        cellContentHeightPx={SCHEDULE_CONTENT_CELL_HEIGHT_PX}
                        cellOverlays={this.taskSchedules}
                        renderOverlay={this.renderOverlay}
                    />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ScheduleMatrix)
