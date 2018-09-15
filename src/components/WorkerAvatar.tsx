import * as React from 'react'
import classnames from 'classnames'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'

import getPic from '../lib/getWorkerPic'
import { Worker } from '../data'

const styles = createStyles({
    selected: {
        opacity: 1,
    },
    notSelected: {
        opacity: 0.2,
    },
})

export interface Props extends WithStyles<typeof styles> {
    worker : Worker
    className ?: string
    selected ?: boolean
}

function WorkerAvatar({
    classes,
    className,
    worker,
    selected = true,
} : Props) {
    return (
        <Avatar
            title={worker.name}
            className={classnames(className, {
                [classes.selected]: selected,
                [classes.notSelected]: !selected,
            })}
            src={getPic(worker)}
        />
    )
}

export default withStyles(styles)(WorkerAvatar)
