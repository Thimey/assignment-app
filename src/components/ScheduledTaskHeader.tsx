import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import { Task } from '../data'

const styles = createStyles({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    text: {
        textAlign: 'center',
    }
})

export interface Props extends WithStyles<typeof styles> {
    task : Task
}

function ScheduledTaskHeader({
    task,
    classes
} : Props) {
    return (
        <div
            className={classes.container}
        >
            <Typography variant="body1" className={classes.text}>
                {task.name}
            </Typography>

            <Typography variant="caption" className={classes.text}>
                {`(qty: ${task.qty})`}
            </Typography>
        </div>
    )
}

export default withStyles(styles)(ScheduledTaskHeader)
