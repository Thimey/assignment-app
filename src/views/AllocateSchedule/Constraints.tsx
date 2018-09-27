import * as React from 'react'
import { observer } from 'mobx-react'
import { uniq } from 'ramda'
import classnames from 'classnames'

import { createStyles, withStyles, Theme, WithStyles } from '@material-ui/core'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { SavedConstraintBase } from '../../data'
import { ConstraintType } from '../../solver'
import saveConstraints from '../../actions/saveConstraints'

import WorkerAvatar from '../../components/WorkerAvatar'

import constraintStore from '../../stores/constraintStore'
import workerStore from '../../stores/workerStore'

import ConstraintAdder from './ConstraintAdder'

const styles = (theme : Theme) => createStyles({
    container: {
        height: '100%',
        overflow: 'scroll',
        paddingTop: '1px',
        paddingLeft: '8px',
        paddingRight: '8px',
    },
    constraintDetails: {
        display: 'flex',
        flexDirection: 'column',
    },
    compContainer: {
        marginTop: '16px',
    },
    expansionPanel: {
        alignItems: 'center',
    },
    expandedPanel: {
        backgroundColor: theme.palette.grey["200"],
    },
    workersSummaryContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft: '8px'
    },
    workerAvatar: {
        marginLeft: '4px',
    },
    collapsedConstraintWithWorkers: {
        backgroundColor: theme.palette.primary.light,
    }
})

export interface Props extends WithStyles<typeof styles> {
}

export interface State {
    expanded : string[]
}

export interface ConstraintsDetails {
    id : ConstraintType
    name : string
    info : string
    comp : ((constraints : SavedConstraintBase[]) => JSX.Element) | null
}

@observer
class Constraints extends React.Component<Props, State> {
    state : State = { expanded: [] }

    private handleChange = (constraint : string) => (_e : any, expanded : boolean) => {
        this.setState((prevState : State) => ({
            expanded: expanded
                ? [...prevState.expanded, constraint]
                : this.state.expanded.filter(c => c !== constraint)
        }))
    }

    private isExpanded(constraint : string) {
        return !!this.state.expanded.find(c => c === constraint)
    }

    private saveConstraints = () => {
        saveConstraints()
    }

    private renderWorker = (workerId : number) => {
        const worker = workerStore.getWorker(workerId)

        if (!worker) {
            return null
        }

        return (
            <WorkerAvatar
                key={worker.id}
                className={this.props.classes.workerAvatar}
                worker={worker}
            />
        )
    }

    private get constraints() : ConstraintsDetails[] {
        return [
            {
                id: ConstraintType.sameTask,
                name: 'Same task constraint',
                info: 'Workers cannot occupy more than one qty position for a scheduled task',
                comp: null,
            },
            {
                id: ConstraintType.sameTime,
                name: 'Same time constraint',
                info: 'Workers cannot work more than one task at the same time',
                comp: null,
            },
            {
                id: ConstraintType.cannotWork,
                name: 'Cannot assign constraint',
                info: 'Add constraints where workers CANNOT perform tasks',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.cannotWork} />
            },
            {
                id: ConstraintType.mustWork,
                name: 'Must assign constraint',
                info: 'Add constraints where workers MUST perform tasks',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.mustWork} />
            },
            {
                id: ConstraintType.atLeastWork,
                name: 'At least assign constraint',
                info: 'Add constraints where workers MUST perform task(s) at LEAST once',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.atLeastWork} />
            },
            {
                id: ConstraintType.timeFatigueTotal,
                name: 'Total time fatigue constraint',
                info: 'Add constraints where workers cannot perform over a limit of time for a task(s)',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.timeFatigueTotal} />
            },
            {
                id: ConstraintType.overallTimeFatigueTotal,
                name: 'Overall total time fatigue constraint',
                info: 'Add constraints where workers cannot perform over a limit of time overall for all tasks',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.overallTimeFatigueTotal} />
            },
            {
                id: ConstraintType.overallTimeFatigueConsecutive,
                name: 'Overall consecutive time fatigue constraint',
                info: 'Add constraints where workers cannot perform over a limit of time consecutively for all tasks',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.overallTimeFatigueConsecutive} />
            },
            {
                id: ConstraintType.unavailable,
                name: 'Unavailability',
                info: 'Add constraints where workers are not available between certain times',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.unavailable} />
            },
            {
                id: ConstraintType.buddy,
                name: 'Buddy constraint',
                info: 'Add constraints where workers perform tasks together',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.buddy} />
            },
            {
                id: ConstraintType.nemesis,
                name: 'Nemesis constraint',
                info: 'Add constraints where workers cannot perform tasks together',
                comp: (constraints : SavedConstraintBase[]) => <ConstraintAdder constraints={constraints} type={ConstraintType.nemesis} />
            },
        ]
    }

    private renderConstraint = ({ id, name, info, comp } : ConstraintsDetails) => {
        let constraints : SavedConstraintBase[] = []

        if (id === ConstraintType.mustWork) {
            constraints = constraintStore.mustWorkConstraints
        } else if (id === ConstraintType.cannotWork) {
            constraints = constraintStore.cannotWorkConstraints
        } else if (id === ConstraintType.atLeastWork) {
            constraints = constraintStore.atLeastWorkConstraints
        } else if (id === ConstraintType.timeFatigueTotal) {
            constraints = constraintStore.timeFatigueTotalConstraints
        } else if (id === ConstraintType.overallTimeFatigueTotal) {
            constraints = constraintStore.overallTimeFatigueTotalConstraints
        } else if (id === ConstraintType.overallTimeFatigueConsecutive) {
            constraints = constraintStore.overallTimeFatigueConsecutiveConstraints
        } else if (id === ConstraintType.unavailable) {
            constraints = constraintStore.unavailableConstraints
        } else if (id === ConstraintType.buddy) {
            constraints = constraintStore.buddyConstraints
        } else if (id === ConstraintType.nemesis) {
            constraints = constraintStore.nemesisConstraints
        }

        const workersIds = uniq(constraints.reduce((acc, c) => (
            c.disabled
                ? acc
                : [...acc, ...c.workers]
        ), []))

        return (
            <ExpansionPanel
                key={id}
                expanded={this.isExpanded(id)}
                onChange={this.handleChange(id)}
                classes={{
                    expanded: this.props.classes.expandedPanel,
                }}
            >
                <ExpansionPanelSummary
                    classes={{
                        content: this.props.classes.expansionPanel,
                        root: classnames({
                            [this.props.classes.collapsedConstraintWithWorkers]: workersIds.length > 0,
                        })
                    }}
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography variant="title">{name}</Typography>

                    <div className={this.props.classes.workersSummaryContainer}>
                        {
                            !this.isExpanded(id) &&
                                workersIds.map(this.renderWorker)

                        }
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={this.props.classes.constraintDetails}>
                    <Typography>
                        {info}
                    </Typography>
                    <div className={this.props.classes.compContainer}>
                        {
                            comp !== null &&
                            comp(constraints)
                        }
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

    render () {
        const {
            classes,
        } = this.props

        return (
            <div className={classes.container}>
                <Button onClick={this.saveConstraints}>
                    Save constraints
                </Button>
                {
                    this.constraints.map(this.renderConstraint)
                }
            </div>
        )
    }
}

export default withStyles(styles)(Constraints)
