import * as React from 'react'
import classnames from 'classnames'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import { Worker } from '../data'
import WorkerPic from './WorkerPic'

const styles = createStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '150px',
        width: '150px',
        border: 'solid 1px',
        cursor: 'pointer'
    },
    selected: {
        opacity: 1,
    },
    notSelected: {
        opacity: 0.2,
    },
    image: {
        width: '100%',
        height: '100%',
    }
})

export interface Props extends WithStyles<typeof styles> {
    worker : Worker
    onClick : (worker : Worker) => void
    selected ?: boolean
}

function WorkerAllocatedCard({
    classes,
    worker,
    selected,
    onClick
} : Props) {
    const handleClick = () => onClick(worker)

    return (
        <div
            onClick={handleClick}
            className={classes.container}
        >
            <WorkerPic
                className={classnames(classes.image, {
                    [classes.selected]: !!selected,
                    [classes.notSelected]: !selected,
                })}
                worker={worker}
            />
        </div>
    )
}

export default withStyles(styles)(WorkerAllocatedCard)
