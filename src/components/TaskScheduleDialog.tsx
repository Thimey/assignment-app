import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'

import { Time } from '../data'
import { getEndTimeOptions, renderTime } from '../lib/time'

const styles = createStyles({
    form: {
        width: '100%',
    }
})

export interface Props extends WithStyles<typeof styles> {
    startTime : Time | null
    onSave : (endTime : Time) => void
    onClose : () => void
}

export interface State {
    endTime : string | null
}

class TaskScheduleDialog extends React.Component<Props, State> {
    state : State = { endTime: null }

    private handleChange = (e : React.ChangeEvent<any>) => this.setState({ endTime: e.target.value })

    private handleSave = () => {
        if (this.state.endTime) {
            const [hour, min] = this.state.endTime.split(':')
                .map((t : string) => parseInt(t.trim(), 10))

            this.props.onSave({ hour, min })
            this.setState({ endTime: null })
        }
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
        const {
            classes,
            startTime,
            onClose,
        } = this.props

        return (
            <Dialog
                open={startTime !== null}
                onClose={onClose}
            >
                <DialogTitle>
                    End time
                </DialogTitle>

                <DialogContent>
                    <FormControl className={classes.form}>
                        <InputLabel htmlFor="end-time">End time</InputLabel>
                        <Select
                            fullWidth
                            value={this.state.endTime || ''}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'End time',
                                id: 'end-time',
                            }}
                        >
                            {
                                startTime &&
                                getEndTimeOptions(startTime)
                                    .map(this.renderTimeMenuItem)
                            }
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="raised" onClick={this.handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(TaskScheduleDialog)
