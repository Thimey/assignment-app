import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'

import allocationSolutionStore from '../stores/allocationSolutionStore'
import { Task, ScheduledTask } from '../data'

const styles = createStyles({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    innerContainer: {
        height: '80%',
        width: '100%',
        backgroundColor: 'blue',
        borderRadius: '5px',
    }
})

export interface Props extends WithStyles<typeof styles> {
    task : Task
    scheduledTask : ScheduledTask
    onDelete ?: (scheduledTaskId : string) => void
}

export interface State {
    hovered : boolean
}

@observer
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
            scheduledTask,
        } = this.props

        const allocated = allocationSolutionStore.getAllocated(scheduledTask.id)

        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                className={classes.container}
            >
                <div className={classes.innerContainer}>
                    {
                        (onDelete && this.state.hovered) &&
                        <Button onClick={this.handleDelete} variant="flat">
                            Remove
                        </Button>
                    }

                    {
                        allocated &&
                        allocated
                            .map(a => a ? <div>{a.name}</div> : null)
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ScheduledTaskOverlay)
