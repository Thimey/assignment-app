import * as React from 'react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import ListItemIcon from '@material-ui/core/ListItemIcon'


const styles = (theme : Theme)=> createStyles({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',

    },
    stepContainer: {
        width: '200px',
    },
    stepContentContainer: {
        height: '100%',
        paddingLeft: '16px',
        width: 'calc(100% - 200px)'
    },
    activeStep: {
        backgroundColor: theme.palette.secondary.light,
    }
})

export interface StepObj {
    comp : JSX.Element
    label : string
    disabled ?: boolean
}

export interface Props extends WithStyles<typeof styles> {
    steps : StepObj[]
    activeStep : number
    onLabelClick : (stepIndex : number) => void
}

@observer
class AllocateStepper extends React.Component<Props> {
    private handleLabelClick = (index : number) => (e : any) =>
        this.props.onLabelClick(index)

    private renderStep = ({ label, disabled } : StepObj, index : number) => {
        return (
            <ListItem
                button
                key={label}
                disabled={disabled}
                onClick={disabled ? undefined : this.handleLabelClick(index)}
                className={classnames({
                    [this.props.classes.activeStep]: this.props.activeStep === index
                })}

            >
                <ListItemText>
                    {label}
                </ListItemText>
            </ListItem>
        )
    }

    private renderCurrentStepContent() {
        const { activeStep, steps } = this.props

        const activeStepObj = steps[activeStep]

        return activeStepObj
            ? activeStepObj.comp
            : null
    }

    render() {
        const { steps, classes } = this.props

        return (
            <div className={classes.container}>
                <div className={classes.stepContainer}>
                    <List
                    >
                        {
                            steps.map(this.renderStep)
                        }
                    </List>
                </div>

                <div className={classes.stepContentContainer}>
                    {
                        this.renderCurrentStepContent()
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(AllocateStepper)
