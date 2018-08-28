import * as React from 'react'
import classnames from 'classnames'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { Schedule } from '../data'

const styles = createStyles({
    selected: {
        backgroundColor: '#d4eff7'
    }

})


export interface Props extends WithStyles<typeof styles> {
    selectedScheduleId : number | null
    schedules : Schedule[]
    onScheduleClick : (schedule : Schedule) => void
}

function ScheduleList({
    classes,
    selectedScheduleId,
    schedules,
    onScheduleClick
} : Props) {
    return (
        <List>
            {
                schedules.map(sch =>
                    <ListItem
                        classes={{
                            button: classnames({
                                [classes.selected]: selectedScheduleId === sch.id
                            })
                        }}
                        button
                        key={sch.id}
                        onClick={() => onScheduleClick(sch)}
                    >
                        <ListItemText primary={sch.name} />
                    </ListItem>
                )
            }
        </List>
    )
}

export default withStyles(styles)(ScheduleList)
