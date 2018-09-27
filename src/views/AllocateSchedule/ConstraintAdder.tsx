import * as React from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import RemoveIcon from '@material-ui/icons/Delete'

import { ConstraintType } from '../../solver'
import {
    SavedConstraintType,
    SavedMustCannotWorkConstraint,
    SavedTimeFatigueTotalConstraint,
    SavedAtLeastWorkConstraint,
    SavedUnavailableConstraint,
    Worker,
    Task,
    Range,
    SavedConstraintBase,
} from '../../data'

import WorkerPicker from '../../components/WorkerPicker'
import TaskPicker from '../../components/TaskPicker'
import TimeRangePicker from '../../components/TimeRangePicker'
import constraintStore from '../../stores/constraintStore'

const styles = createStyles({
    container: {
    },
    workerPickerContainer: {
        width: '30%',
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
        width: '40%',
    },
    addButton: {
        marginTop: '16px',
    },
    disabled: {
        opacity: 0.2,
    }
})


export interface Props extends WithStyles<typeof styles> {
    type : ConstraintType
    constraints : SavedConstraintBase[]
    color ?: string
}

export interface State {
}

@observer
class MustCannotConstraint extends React.Component<Props, State> {
    private addNewConstraint = (_e : any) => {
        constraintStore.addNewConstraint(this.props.type)
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

    private toggleDisable = (index: number, constraint : SavedMustCannotWorkConstraint | SavedTimeFatigueTotalConstraint) => (e : any) => {
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

    private handleTimeLimitChange = (index : number, constraint : SavedTimeFatigueTotalConstraint | SavedTimeFatigueTotalConstraint) => (e : any) => {
        constraintStore.updateConstraint(
            this.props.type,
            index,
            {
                ...constraint,
                limit: parseInt(e.target.value, 10),
            }
        )
    }

    private handleUnavailableTimeRangeChange = (index: number, constraint: SavedUnavailableConstraint) => (range : Range) => {
        constraintStore.updateConstraint(
            this.props.type,
            index,
            {
                ...constraint,
                range,
            }
        )
    }


    private renderTitle1() {
        const { type } = this.props
        let title = ''
        if (type === ConstraintType.mustWork) {
            title = 'must perform all'
        } else if (type === ConstraintType.cannotWork) {
            title = 'cannot perform'
        } else if (type === ConstraintType.timeFatigueTotal) {
            title = 'limit of'
        } else if (type === ConstraintType.atLeastWork) {
            title = 'at least once'
        } else if (type === ConstraintType.overallTimeFatigueTotal) {
            title = 'overall limit of'
        } else if (type === ConstraintType.overallTimeFatigueConsecutive) {
            title = 'consecutive limit of'
        } else if (type === ConstraintType.unavailable) {
            title = 'unavailable between'
        } else if (type === ConstraintType.buddy) {
            title = 'work together on'
        } else if (type === ConstraintType.nemesis) {
            title = 'work cannot together on'
        } else {
            return null
        }

        return (
            <Typography variant="title">
                { title }
            </Typography>
        )
    }

    private renderTitle2() {
        if (this.props.type !== ConstraintType.timeFatigueTotal) {
            return null
        }

        return (
            <Typography variant="title">
                in
            </Typography>
        )
    }

    private renderLimitField(index : number, constraint : SavedConstraintType) {
        if (
            this.props.type !== ConstraintType.timeFatigueTotal &&
            this.props.type !== ConstraintType.overallTimeFatigueTotal &&
            this.props.type !== ConstraintType.overallTimeFatigueConsecutive
        ) {
            return null
        }

        const fatigueConstraint = constraint as SavedTimeFatigueTotalConstraint

        return (
            <TextField
                type="number"
                inputProps={{
                    min: 1,
                }}
                onChange={this.handleTimeLimitChange(index, fatigueConstraint)}
                value={fatigueConstraint.limit}
                InputProps={{
                    endAdornment: <InputAdornment position="end">mins</InputAdornment>,
                }}
            />
        )
    }

    private renderTaskPicker(index : number, constraint : SavedConstraintType) {
        if (
            this.props.type === ConstraintType.overallTimeFatigueTotal ||
            this.props.type === ConstraintType.overallTimeFatigueConsecutive ||
            this.props.type === ConstraintType.unavailable
        ) {
            return null
        }

        const taskConstraint = constraint as (SavedMustCannotWorkConstraint | SavedAtLeastWorkConstraint | SavedTimeFatigueTotalConstraint)

        return (
            <div className={this.props.classes.taskPickerContainer}>
                <TaskPicker
                    selectedTaskIds={taskConstraint.tasks}
                    onSelect={this.updateTasks(index, taskConstraint)}
                    />
            </div>
        )
    }

    private renderTimeRangePicker(index : number, constraint : SavedConstraintType) {
        if (this.props.type === ConstraintType.unavailable) {
            const { range } = constraint as SavedUnavailableConstraint

            return (
                <TimeRangePicker
                    onRangeChange={this.handleUnavailableTimeRangeChange(index, constraint as SavedUnavailableConstraint)}
                    range={range}
                />
            )
        }

        return null
    }

    private renderConstraint = (constraint : SavedMustCannotWorkConstraint, index : number) => {
        const { classes, color } = this.props

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

                    {
                        this.renderTitle1()
                    }

                    {
                        this.renderLimitField(index, constraint)
                    }

                    {
                        this.renderTitle2()
                    }

                    {
                        this.renderTaskPicker(index, constraint)
                    }

                    {
                        this.renderTimeRangePicker(index, constraint)
                    }
                </Paper>
            </div>
        )
    }

    render () {
        const {
            classes,
            constraints,
        } = this.props

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
