import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'

import { Worker, Task } from '../data'
import costStore from '../stores/costStore'
import updateCurrentCostMatrix from '../actions/updateCurrentCostMatrix'

const styles = createStyles({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    popover: {
        padding: '10px',
    }

})

export interface Props extends WithStyles<typeof styles> {
    worker : Worker
    task : Task
}

export interface State {
    open : boolean
}

@observer
class CostCell extends React.Component<Props, State> {
    state : State = { open: false }
    private anchorEl : HTMLElement | null = null

    private getColor(cost : number){
        const hue = ((1 - cost / 100) * 120).toString(10)

        return {
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
        }
    }

    private handleOpen = () => this.setState({ open: true })
    private handleClose = () => {
        this.setState({ open: false })
        updateCurrentCostMatrix()
    }

    private handleCostChange = (e : any) => {
        costStore.updateCostMatrix(
            this.props.worker.id,
            this.props.task.id,
            parseInt(e.target.value, 10)
        )
    }

    render () {
        const {
            classes,
            worker,
            task,
        } = this.props

        const cost = costStore.getCost(worker, task)

        return (
            <React.Fragment>
                <div
                    className={classes.container}
                    style={this.getColor(cost)}
                    ref={(node : HTMLElement | null) => {this.anchorEl = node}}
                    onClick={this.handleOpen}
                >
                    {cost}
                </div>

                <Popover
                    anchorEl={this.anchorEl}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    onClose={this.handleClose}
                    open={this.state.open}
                >
                    <div className={classes.popover}>
                        <TextField
                            type="number"
                            onChange={this.handleCostChange}
                            value={cost}
                        />
                    </div>
                </Popover>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(CostCell)
