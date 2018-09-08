import * as React from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'

import WorkerAvatar from './WorkerAvatar'
import allocationSolutionStore from '../stores/allocationSolutionStore'
import { Task, ScheduledTask, Worker } from '../data'

const styles = createStyles({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    innerContainer: {
        height: '95%',
        width: '100%',
        borderRadius: '5px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    notAllocated: {
        backgroundColor: 'blue',
    },
    allocated: {
        backgroundColor: 'darkseagreen',
    },
    avatar: {
        width: 45,
        height: 45,
    }
})

export interface Props extends WithStyles<typeof styles> {
    task : Task
    scheduledTask : ScheduledTask
    onDelete ?: (scheduledTaskId : string) => void
    width : number
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

    private renderAllocation = (worker : Worker | undefined) => {
        if (!worker) {
            return null
        }

        return (
            <WorkerAvatar
                key={worker.id}
                className={this.props.classes.avatar}
                worker={worker}
            />
        )
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
                <div className={classnames(classes.innerContainer, {
                    [classes.notAllocated]: !allocated,
                    [classes.allocated]: allocated,
                })}>
                    {
                        (onDelete && this.state.hovered && !allocated) &&
                        <Button onClick={this.handleDelete} variant="flat">
                            Remove
                        </Button>
                    }

                    {
                        allocated &&
                        allocated.map(this.renderAllocation)
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ScheduledTaskOverlay)
