import * as React from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import RemoveIcon from '@material-ui/icons/Delete'

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
        marginTop: '16px',
        display: 'flex',
    },
    constraintPaperContainer: {
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    actionContainer: {
        marginLeft: '16px',
        width: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    taskPickerContainer: {
        width: '400px',
    },
    addButton: {
        marginTop: '16px',
    },
    disabled: {
        opacity: 0.2,
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

    private updateWorkers = (index: number, constraint : SavedMustCannotWorkConstraint) => (selectedWorkerIds : Worker['id'][]) => {
        constraintStore.updateConstraint(
            this.props.type,
            index,
            {
                ...constraint,
                workers: selectedWorkerIds,
            }
        )
    }

    private updateTasks = (index: number, constraint : SavedMustCannotWorkConstraint) => (selectedTaskIds : Task['id'][]) => {
        constraintStore.updateConstraint(
            this.props.type,
            index,
            {
                ...constraint,
                tasks: selectedTaskIds,
            }
        )
    }

    private toggleDisable = (index: number, constraint : SavedMustCannotWorkConstraint) => (e : any) => {
        constraintStore.updateConstraint(
            this.props.type,
            index,
            {
                ...constraint,
                disabled: !constraint.disabled,
            }
        )
    }

    private handleRemove = (index : number) => () => {
        constraintStore.deleteConstraint(this.props.type, index)
    }

    private renderConstraint = (constraint : SavedMustCannotWorkConstraint, index : number) => {
        const { classes, color, type } = this.props

        return (
            <div
                key={index}
                className={classes.constraintContainer}
            >
                <div className={classes.actionContainer}>
                    <Switch
                        checked={!constraint.disabled}
                        onChange={this.toggleDisable(index, constraint)}
                    />
                    <Button onClick={this.handleRemove(index)}>
                        <RemoveIcon  />
                    </Button>
                </div>
                <Paper
                    style={{
                        backgroundColor: color || 'white',
                    }}
                    className={classnames(classes.constraintPaperContainer, {
                        [classes.disabled]: constraint.disabled,
                    })}
                >

                    <div className={classes.workerPickerContainer}>
                        <WorkerPicker
                            selectedWorkerIds={constraint.workers}
                            onSelect={this.updateWorkers(index, constraint)}
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
                            selectedTaskIds={constraint.tasks}
                            onSelect={this.updateTasks(index, constraint)}
                            />
                    </div>

                </Paper>
            </div>
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
