import * as React from 'react'
import classnames from 'classnames'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import { Worker } from '../data'

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
        backgroundColor: 'red',
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
    const { name } = worker

    const handleClick = () => onClick(worker)

    return (
        <div
            onClick={handleClick}
            className={classnames(classes.container, {
                [classes.selected]: !!selected,
            })}
        >
            { name }
        </div>
    )
}

export default withStyles(styles)(WorkerAllocatedCard)
