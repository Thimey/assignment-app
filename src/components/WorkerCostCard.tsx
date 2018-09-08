import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import { Worker } from '../data'
import WorkerPic from './WorkerPic'

const styles = createStyles({
    container: {
        height: '100%',
        width: '100%',
        border: 'solid 1px',
    },
    image: {
        width: '100%',
        height: '100%',
    }
})

export interface Props extends WithStyles<typeof styles> {
    worker : Worker
}

function WorkerCostCard({
    classes,
    worker,
} : Props) {
    return (
        <div
            className={classes.container}
        >
            <WorkerPic
                className={classes.image}
                worker={worker}
            />
            {/* { name } */}
        </div>
    )
}

export default withStyles(styles)(WorkerCostCard)
