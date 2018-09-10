import * as React from 'react'
import { createStyles, withStyles, WithStyles, Typography } from '@material-ui/core'
import LinearProgress from '@material-ui/core/LinearProgress'

const styles = createStyles({
    root: {
        flexGrow: 1,
    },
    timeRemaining: {
        textAlign: 'center',
        marginTop: '8px',
    }
})

const TIME_INC_MS = 500

export interface Props extends WithStyles<typeof styles> {
    time : number | null
}

export interface State {
    completed : number
}

const msToMins = (ms : number) => ms / (1000 * 60)

class SolverProgress extends React.Component<Props, State> {
    private timer : any = null

    state : State = {
        completed: 0,
    }

    componentDidMount() {
        if (this.props.time) {
            this.timer = setInterval(this.progress, TIME_INC_MS)
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }

    private progress = () => {
        const { completed } = this.state
        if (completed < 100 && this.props.time !== null) {
            this.setState((prevState : State) => ({
                completed: prevState.completed + msToMins(TIME_INC_MS)
            }))
        }
    }

    render() {
        const { classes, time } = this.props
        const { completed } = this.state

        const percent = time
            ? (completed / time) * 100
            : undefined

        const remainingTimeMins = (percent && time)
            ? Math.round((100 - percent) * time) / 100
            : null

        return (
            <div className={classes.root}>
                <LinearProgress
                    color="secondary"
                    variant={time ? 'determinate' : 'indeterminate'}
                    value={percent}
                />

                {
                    remainingTimeMins &&
                    <Typography className={classes.timeRemaining} variant="caption">
                        {
                            remainingTimeMins < 0
                                ? 'Done!'
                                : `(${remainingTimeMins} mins remaining)`
                        }
                    </Typography>
                }
            </div>
        )
    }
}


export default withStyles(styles)(SolverProgress)