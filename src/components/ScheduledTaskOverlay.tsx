import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'


import { Task, Worker, ScheduledTask } from '../data'

const styles = createStyles({
    container: {
        width: '100%',
        height: '100%',
    }
})

export interface Props extends WithStyles<typeof styles> {
    task : Task
    scheduledTask : ScheduledTask
    onDelete ?: (scheduledTaskId : string) => void
    allocated ?: Worker[]
}

export interface State {
    hovered : boolean
}

class ScheduledTaskOverlay extends React.Component<Props, State> {
    state = { hovered : false }

    private handleMouseEnter = () => this.setState({ hovered: true })
    private handleMouseLeave = () => this.setState({ hovered: false })
    private handleDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.scheduledTask.id)
        }
    }

    render () {
        const {
            classes,
            onDelete,
        } = this.props

        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                className={classes.container}
            >
                {
                    (onDelete && this.state.hovered) &&
                    <Button onClick={this.handleDelete} variant="flat">
                        Remove
                    </Button>
                }
            </div>
        )
    }
}

export default withStyles(styles)(ScheduledTaskOverlay)
