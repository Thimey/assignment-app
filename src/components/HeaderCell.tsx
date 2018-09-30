import * as React from 'react'
import { createStyles, withStyles, WithStyles, Typography } from '@material-ui/core'

const styles = createStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        textAlign: 'center',
    },
})

export interface Props extends WithStyles<typeof styles> {
    text : string
}

function HeaderCell({
    classes,
    text,
} : Props) {
    return (
        <Typography variant="body1" className={classes.container}>
            { text }
        </Typography>
    )
}

export default withStyles(styles)(HeaderCell)
