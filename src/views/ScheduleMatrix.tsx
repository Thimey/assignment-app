import * as React from 'react'
import Matrix from '../components/Matrix'

import getTimes from '../lib/getTimes'
import { Task, Schedule, Time } from '../data'

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
    schedules : Schedule[]
    tasks : Task[]
}

export interface State {
    displaySchedule : Schedule | null
}

class ScheduleMatrix extends React.Component<Props, State> {
    state = { displaySchedule: null }

    private get times() {
        return getTimes(9, 18)
    }

    private get cells() {
        const { tasks } = this.props

        return tasks.reduce((acc, _task) => ([
            ...acc,
            [...this.times],
        ]), [])
    }

    private renderBlank = (cost : number) => <div></div>
    private renderTask = (task : Task) => <div>{task.name}</div>
    private renderTime = (time : Time) => <div>{`${time.hour} : ${time.min}`}</div>

    public render() {
        const { tasks } = this.props

        return (
            <div className={this.props.classes.container}>
                <Matrix
                    cells={this.cells}
                    colHeaders={this.times}
                    rowHeaders={tasks}
                    renderCell={this.renderBlank}
                    renderColHeader={this.renderTime}
                    renderRowHeader={this.renderTask}
                    cellWidthPx={CELL_WIDTH_PX}
                    cellHeaderHeightPx={HEADER_CELL_HEIGHT_PX}
                    cellContentHeightPx={CONTENT_CELL_HEIGHT_PX}
                />
            </div>
        )
    }
}

export default withStyles(styles)(ScheduleMatrix)
