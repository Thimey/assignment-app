import * as React from 'react'
import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Popover from '@material-ui/core/Popover'
import FilterIcon from '@material-ui/icons/Filter'

import { Worker } from '../data'

import WorkerPicker from './WorkerPicker'
import TaskPicker from './TaskPicker'

const styles = createStyles({
    button: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    },
    popover: {
    },
    paper: {
        flexDirection: 'column',
        display: 'flex',
        width: '400px',
        padding: '16px',
    }
})

export interface Props extends WithStyles<typeof styles> {
    selectedTaskIds : number[]
    onTaskSelect : (newSelectedIds : number[]) => void
    selectedWorkerIds ?: number[]
    onWorkerSelect ?: (newWorkerIds : Worker['id'][]) => void
}

@observer
class CornerMatrixFilter extends React.Component<Props, { open : boolean }> {
    state = { open: false }
    private anchorEl : HTMLElement | null = null

    private handleOpen = () => this.setState({ open: true })
    private handleClose = () => this.setState({ open: false })

    private assignAnchor = (node : HTMLElement | null) => {
        this.anchorEl = node
    }

    render() {
        const {
            classes,
            selectedWorkerIds,
            onWorkerSelect,
            selectedTaskIds,
            onTaskSelect,
        } = this.props

        return (
            <React.Fragment>
                <div
                    ref={this.assignAnchor}
                    className={classes.button}
                    onClick={this.handleOpen}
                >
                    <FilterIcon />
                </div>
                <Popover
                    anchorEl={this.anchorEl}
                    open={this.state.open}
                    onClose={this.handleClose}
                    className={classes.popover}
                    classes={{
                        paper: classes.paper,
                    }}
                >
                    {
                        (selectedWorkerIds && onWorkerSelect) &&
                        <WorkerPicker
                            selectedWorkerIds={selectedWorkerIds}
                            onSelect={onWorkerSelect}
                        />
                    }

                    <TaskPicker
                        selectedTaskIds={selectedTaskIds}
                        onSelect={onTaskSelect}
                    />
                </Popover>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(CornerMatrixFilter)
