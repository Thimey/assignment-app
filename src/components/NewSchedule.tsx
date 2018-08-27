import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'

import { Schedule } from '../data'

const styles = createStyles({
    container: {
    }
})


export interface Props extends WithStyles<typeof styles> {
    onSave : (schedule : Partial<Schedule>) => void
}

export interface State {
    name : string
    open : boolean
}

class NewSchedule extends React.Component<Props, State> {
    state = { open: false, name: '' }

    private handleSave = () => {
        this.props.onSave({
            name: this.state.name,
            tasks: [],
        })
        this.handleClose()
    }

    private handleOpen = () => this.setState({ open: true })
    private handleClose = () => this.setState({ open: false })
    private handleChange = (e : any) => this.setState({ name: e.target.value })


    render () {
        const {
            classes,
        } = this.props

        return (
            <React.Fragment>
                <Button variant="raised" onClick={this.handleOpen}>
                    New Schedule
                </Button>

                <Dialog
                    onClose={this.handleClose}
                    open={this.state.open}
                    className={classes.container}
                >
                    <DialogTitle>
                        New Schedule
                    </DialogTitle>

                    <DialogContent>
                        <TextField
                            placeholder="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleSave}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(NewSchedule)
