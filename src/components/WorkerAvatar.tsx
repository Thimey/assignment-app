import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'

import getPic from '../lib/getWorkerPic'
import { Worker } from '../data'

const styles = createStyles({})

export interface Props extends WithStyles<typeof styles> {
    worker : Worker
    className ?: string
}

function WorkerAvatar({
    className,
    worker,
} : Props) {
    return (
        <Avatar
            title={worker.name}
            className={className}
            src={getPic(worker)}
        />
    )
}

export default withStyles(styles)(WorkerAvatar)
