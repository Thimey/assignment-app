import * as React from 'react'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import allocationSolutionStore from '../stores/allocationSolutionStore'
import costStore from '../stores/costStore'
import modelStore from '../stores/modelStore'
import scheduleStore from '../stores/scheduleStore'

import getCostColor from '../lib/getCostColor'
import { filterWorker } from '../lib/filterWorkers'
import { filterTask } from '../lib/filterTasks'

import { Task, ScheduledTask, Worker } from '../data'
import WorkerAvatar from './WorkerAvatar'
import { SolveOption } from '../solver'

const styles = (theme: Theme) => createStyles({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        height: '95%',
        width: 'calc(100% - 8px)',
        borderRadius: '5px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    innerContainerTaskView: {
        flexDirection: 'column',
    },
    notAllocated: {
        backgroundColor: theme.palette.primary.light,
    },
    allocated: {
        backgroundColor: theme.palette.grey["200"],
    },
    avatar: {
        width: 45,
        height: 45,
    },
    text: {
        textAlign: 'center',
    }
})

export interface Props extends WithStyles<typeof styles> {
    task : Task
    scheduledTask : ScheduledTask
    onDelete ?: (scheduledTaskId : string) => void
    width : number
    view : 'worker' | 'task'
    worker ?: Worker // only for task view
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

    private getTaskAllocatedColor(workers : (Worker | undefined)[] | null) {
        if (!workers) {
            return undefined
        }

        const totalCost = workers.reduce((acc, worker) => {
            if (!worker) {
                return acc
            }

            return acc + costStore.getCost(worker, this.props.task)

        }, 0)

        return getCostColor(totalCost / this.props.task.qty)
    }

    private renderWorkerAllocation = (worker : Worker | undefined) => {
        if (!worker) {
            return null
        }

        // Filter out avatar if not in schedule filter
        if (
            allocationSolutionStore.getScheduledTaskAllocated(this.props.scheduledTask.id) &&
            this.props.view === 'worker' &&
            !filterWorker(scheduleStore.scheduleWorkerFilter)(worker)
        ) {
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

    @computed
    private get showCost() {
        return modelStore.selectedSolution !== SolveOption.noOptimisation
    }

    render () {
        const {
            classes,
            onDelete,
            scheduledTask,
            view,
            task,
            worker,
        } = this.props

        const allocated = view === 'worker'
            ? allocationSolutionStore.getScheduledTaskAllocated(scheduledTask.id)
            : []

        const cost = worker
            ? costStore.getCost(worker, task)
            : null


        let backgroundStyle = undefined

        if (this.showCost) {
            backgroundStyle = (view === 'task' && worker)
                ? getCostColor(cost!)
                : this.getTaskAllocatedColor(allocated)
        }

        // If task, only show if in task filter
        if (allocated && view === 'task' && !filterTask(scheduleStore.scheduleTaskFilter.toLowerCase())(task)) {
            return null
        }

        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                className={classes.container}
            >
                <div
                    style={backgroundStyle}
                    className={classnames(classes.innerContainer, {
                        [classes.notAllocated]: !allocated,
                        [classes.allocated]: allocated,
                        [classes.innerContainerTaskView]: view === 'task',
                    })}
                >
                    {
                        (onDelete && this.state.hovered && !allocated) &&
                        <Button onClick={this.handleDelete} variant="flat">
                            Remove
                        </Button>
                    }

                    {
                        allocated && view === 'worker' &&
                        allocated.map(this.renderWorkerAllocation)
                    }

                    {
                        view === 'task' && (
                            <React.Fragment>
                                <Typography className={classes.text}>
                                    { task.name }
                                </Typography>
                                {
                                    this.showCost &&
                                    <Typography variant='caption' className={classes.text}>
                                        {
                                            `(${cost})`
                                        }
                                    </Typography>
                                }
                            </React.Fragment>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ScheduledTaskOverlay)
