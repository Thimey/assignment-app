import * as React from 'react'
import { observer } from 'mobx-react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { ConstraintType } from '../../solver'
import { SavedMustCannotWorkConstraint, Worker, Task } from '../../data'

import WorkerPicker from '../../components/WorkerPicker'
import TaskPicker from '../../components/TaskPicker'
import constraintStore from '../../stores/constraintStore'

const styles = createStyles({
    container: {
    },
    workerPickerContainer: {
        width: '400px',
    },
    constraintContainer: {
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '16px',
    },
    taskPickerContainer: {
        width: '400px',
    },
    addButton: {
        marginTop: '16px',
    }
})


export interface Props extends WithStyles<typeof styles> {
    type : ConstraintType.mustWork | ConstraintType.cannotWork
    color ?: string
}

export interface State {
}

@observer
class MustCannotConstraint extends React.Component<Props, State> {
    private addNewConstraint = (_e : any) => {
        constraintStore.addNewConstraint(
            this.props.type,
            {
                tasks: [],
                workers: [],
            }
        )
    }

    private updateWorkers = (index: number, currentTaskIds : number[]) => (selectedWorkerIds : Worker['id'][]) => {
        constraintStore.updateConstraint(
            this.props.type,
            index,
            {
                workers: selectedWorkerIds,
                tasks: currentTaskIds,
            }
        )
    }

    private updateTasks = (index: number, currentWorkerIds : number[]) => (selectedTaskIds : Task['id'][]) => {
        constraintStore.updateConstraint(
            this.props.type,
            index,
            {
                tasks: selectedTaskIds,
                workers: currentWorkerIds,
            }
        )
    }

    private renderConstraint = ({ workers, tasks } : SavedMustCannotWorkConstraint, index : number) => {
        const { classes, color, type } = this.props

        return (
            <Paper
                key={index}
                style={{
                    backgroundColor: color || 'white',
                }}
                className={classes.constraintContainer}>

                <div className={classes.workerPickerContainer}>
                    <WorkerPicker
                        selectedWorkerIds={workers}
                        onSelect={this.updateWorkers(index, tasks)}
                    />
                </div>

                <Typography variant="title">
                    {
                        type === ConstraintType.mustWork
                            ? 'must'
                            : 'cannot'
                    } perform
                </Typography>

                <div className={classes.taskPickerContainer}>
                    <TaskPicker
                        selectedTaskIds={tasks}
                        onSelect={this.updateTasks(index, workers)}
                    />
                </div>

            </Paper>
        )
    }

    render () {
        const {
            type,
            classes,
        } = this.props

        let constraints = [] as any

        if (type === ConstraintType.mustWork) {
            constraints = constraintStore.mustWorkConstraints
        } else if (type === ConstraintType.cannotWork) {
            constraints = constraintStore.cannotWorkConstraints
        }

        return (
            <React.Fragment>
                {
                    constraints.map(this.renderConstraint)
                }

                <Button
                    className={classes.addButton}
                    fullWidth
                    onClick={this.addNewConstraint}
                >
                    Add
                </Button>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(MustCannotConstraint)
