import * as React from 'react'
import { observer } from 'mobx-react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import { ConstraintType } from '../../solver'
import { SavedMustCannotWorkConstraint, Worker } from '../../data'

import WorkerPicker from '../../components/WorkerPicker'
import constraintStore from '../../stores/constraintStore'

const styles = createStyles({
    container: {
    }
})


export interface Props extends WithStyles<typeof styles> {
}

export interface State {
}

@observer
class MustCannotConstraint extends React.Component<Props, State> {

    private updateWorkers = (index: number, currentTaskIds : number[]) => (selectedWorkerIds : Worker['id'][]) => {
        constraintStore.updateConstraint(
            ConstraintType.mustWork,
            index,
            {
                workers: selectedWorkerIds,
                tasks: currentTaskIds,
            }
        )
    }

    private renderConstraint = ({ workers, tasks } : SavedMustCannotWorkConstraint, index : number) => {


        return (
            <div>
                <WorkerPicker
                    selectedWorkerIds={workers}
                    onSelect={this.updateWorkers(index, tasks)}
                />
            </div>
        )
    }

    render () {
        const {
            // classes,
        } = this.props

        return (
            <div>
                {
                    constraintStore.mustWorkConstraints.map(this.renderConstraint)
                }
            </div>
        )
    }
}

export default withStyles(styles)(MustCannotConstraint)
