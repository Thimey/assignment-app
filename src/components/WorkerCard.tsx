import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

const styles = createStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        width: '200px',
        border: 'solid 1px'
    }
})


export interface IProps extends WithStyles<typeof styles> {
    id : string
    name : string
    pic ?: string
}

function WorkerCard({
    classes,
    id,
    name,
    pic
} : IProps) {
    return (
        <div className={classes.container}>
            { name }
        </div>
    )
}

export default withStyles(styles)(WorkerCard)
