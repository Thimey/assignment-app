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
    key ?: any
}

function WorkerAvatar({
    classes,
    className,
    worker,
    selected = true,
    key,
} : Props) {
    return (
        <Avatar
            key={key}
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
