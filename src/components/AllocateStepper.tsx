import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'


const styles = createStyles({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',

    },
    stepContainer: {
        width: '200px',
    },
    stepContentContainer: {
        flex: 1,
        height: '100%',
    },
})

export interface StepObj {
    comp : JSX.Element
    label : string
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

    private renderStep = ({ label, comp } : StepObj, index : number) => {
        return (
            <Step key={label}>
                <StepLabel
                    onClick={this.handleLabelClick(index)}
                >
                    {label}
                </StepLabel>
            </Step>
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
                    <Stepper
                        orientation="vertical"
                        activeStep={this.props.activeStep}
                    >
                        {
                            steps.map(this.renderStep)
                        }
                    </Stepper>
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
