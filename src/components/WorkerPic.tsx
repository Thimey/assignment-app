import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import getPic from '../lib/getWorkerPic'
import { Worker } from '../data'

const styles = createStyles({})

export interface Props extends WithStyles<typeof styles> {
    worker : Worker
    className ?: string
}

function WorkerPic({
    className,
    worker,
} : Props) {
    return (
        <img
            title={worker.name}
            className={className}
            src={getPic(worker)}
        />
    )
}

export default withStyles(styles)(WorkerPic)
