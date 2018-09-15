import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { ConstraintType } from '../../solver'

import MustCannotConstraint from './MustCannotConstraint'

const styles = createStyles({
    container: {
        width: '100%',
    },
    constraintDetails: {
        display: 'flex',
        flexDirection: 'column',
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
    comp : JSX.Element | null
}


class Constraints extends React.Component<Props, State> {
    state : State = { expanded: ['cannotWork'] }

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
                comp: <div></div>
            },
            {
                id: ConstraintType.mustWork,
                name: 'Must assign constraint',
                info: 'Add constraints where workers MUST perform tasks',
                comp: <MustCannotConstraint />
            },
        ]
    }

    private renderConstraint = ({ id, name, info, comp } : ConstraintsDetails) => {
        return (
            <ExpansionPanel key={id} expanded={this.isExpanded(id)} onChange={this.handleChange(id)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="title">{name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={this.props.classes.constraintDetails}>
                    <Typography>
                        {info}
                    </Typography>
                    <div>
                        {comp}
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
                {
                    this.constraints.map(this.renderConstraint)
                }
            </div>
        )
    }
}

export default withStyles(styles)(Constraints)
