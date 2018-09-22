import * as React from 'react'
import { observer } from 'mobx-react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'

import { getEndTimeOptions, renderTime, getTimes, renderTimeToTime } from '../lib/time'

import { Range, Time } from '../data'

const styles = createStyles({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
})

export interface Props extends WithStyles<typeof styles> {
    onRangeChange : (range : Range) => void
    range : Range
}

@observer
class TimeRangePicker extends React.Component<Props> {

    private handleStartChange = (e : React.ChangeEvent<any>) => {
        this.props.onRangeChange({
            startTime: renderTimeToTime(e.target.value),
            endTime: this.props.range.endTime,
        })
    }

    private handleEndChange = (e : React.ChangeEvent<any>) => {
        this.props.onRangeChange({
            startTime: this.props.range.startTime,
            endTime: renderTimeToTime(e.target.value),
        })
    }

    private renderTimeMenuItem = (time : Time) => {
        const timeStr = renderTime(time)

        return (
            <MenuItem key={timeStr} value={timeStr} >
                {timeStr}
            </MenuItem>
        )
    }

    render() {

        const { range, classes } = this.props

        return (
            <div className={classes.container}>
                {/* start */}
                <Select
                    fullWidth
                    value={renderTime(range.startTime)}
                    onChange={this.handleStartChange}
                    inputProps={{
                        name: 'Start time',
                        id: 'start-time',
                    }}
                >
                    {
                        getTimes()
                            .map(this.renderTimeMenuItem)
                    }
                </Select>

                <Typography variant='caption'>
                    to
                </Typography>

                {/* end */}
                <Select
                    fullWidth
                    value={renderTime(range.endTime)}
                    onChange={this.handleEndChange}
                    inputProps={{
                        name: 'End time',
                        id: 'end-time',
                    }}
                >
                    {
                        getEndTimeOptions(range.startTime)
                            .map(this.renderTimeMenuItem)
                    }
                </Select>
            </div>
        )
    }
}

export default withStyles(styles)(TimeRangePicker)

