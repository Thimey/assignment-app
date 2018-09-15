import * as React from 'react'
import { observer } from 'mobx-react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import Chip from '@material-ui/core/Chip'

import { Task } from '../data'
import taskStore from '../stores/taskStore'

const styles = createStyles({
container: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
},
chips: {
    display: 'flex',
    flexWrap: 'wrap',
},
chip: {
    margin: '4px',
},
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
PaperProps: {
    style: {
    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    width: 250,
    },
},
}

export interface Props extends WithStyles<typeof styles> {
    selectedTaskIds : number[]
    onSelect : (newSelectedIds : number[]) => void
}

@observer
class TaskPicker extends React.Component<Props> {
    handleChange = (e : any) => {
        const newTaskIds = e.target.value

        this.props.onSelect(newTaskIds)
    }

    private isSelected(taskId : Task['id']) {
        return this.props.selectedTaskIds.find(id => id === taskId) !== undefined
    }

    private renderMenuItem = (task : Task) => (
        <MenuItem key={task.id} value={task.id}>
            <Checkbox checked={this.isSelected(task.id)} />
            <ListItemText primary={task.name} />
        </MenuItem>
    )

    private getName(taskId : Task['id']) {
        const task = taskStore.getTask(taskId)

        return task
            ? task.name
            : ''
    }

    private renderValue = (selected : number[]) => (
        <div className={this.props.classes.chips}>
            {
                selected.map(taskId => (
                    <Chip key={taskId} label={this.getName(taskId)} className={this.props.classes.chip} />
                ))
            }
        </div>
    )

    render() {
        const { classes } = this.props

        return (
            <div className={classes.container}>
                <Select
                    fullWidth
                    multiple
                    value={this.props.selectedTaskIds}
                    onChange={this.handleChange}
                    renderValue={this.renderValue}
                    MenuProps={MenuProps}
                >
                    {taskStore.tasks.map(this.renderMenuItem)}
                </Select>
            </div>
        )
    }
}


export default withStyles(styles)(TaskPicker)