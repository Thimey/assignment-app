import * as React from 'react'
// import { observer } from 'mobx-react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Popover from '@material-ui/core/Popover'
import FilterIcon from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'

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
        width: '300px',
        padding: '16px',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    iconButton: {
        padding: 0,
    },
})

export interface Props extends WithStyles<typeof styles> {
    onTaskChange : (value : string) => void
    onWorkerChange : (value : string) => void
    workerFilter : string
    taskFilter : string
}

class CornerMatrixFilter extends React.Component<Props, { open : boolean }> {
    state = { open: false }
    private anchorEl : HTMLElement | null = null

    private handleOpen = () => this.setState({ open: true })
    private handleClose = () => this.setState({ open: false })

    private assignAnchor = (node : HTMLElement | null) => {
        this.anchorEl = node
    }

    private handleTaskFilterChange = (e : any) => {
        this.props.onTaskChange(e.target.value)
    }

    private handleWorkerFilterChange = (e : any) => {
        this.props.onWorkerChange(e.target.value)
    }

    private clearTaskFilter = () => {
        this.props.onTaskChange('')
    }

    private clearWorkerFilter = () => {
        this.props.onWorkerChange('')
    }

    render() {
        const {
            classes,
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
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <div className={classes.inputContainer}>
                        <TextField
                            onChange={this.handleTaskFilterChange}
                            value={this.props.taskFilter}
                            fullWidth
                            placeholder='Task'
                        />
                        <Button
                            className={classes.iconButton}
                             onClick={this.clearTaskFilter}
                        >
                            <CloseIcon />
                        </Button>
                    </div>

                    <div className={classes.inputContainer} style={{ marginTop: '8px' }}>
                        <TextField
                            onChange={this.handleWorkerFilterChange}
                            value={this.props.workerFilter}
                            fullWidth
                            placeholder='Worker'
                        />
                        <Button
                            className={classes.iconButton}
                            onClick={this.clearWorkerFilter}
                        >
                            <CloseIcon />
                        </Button>
                    </div>

                </Popover>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(CornerMatrixFilter)
