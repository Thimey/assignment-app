import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

const styles = createStyles({
    details: {
        marginBottom: '8px',
    },
})

export interface Props extends WithStyles<typeof styles> {
    info : {
        name : string
        details : string
    }[]
}

function InfoList({ classes, info } : Props) {

    return (
        <ol>
            {
                info.map(({ name, details }) => (
                    <li key={name}>
                        <Typography variant="body1">
                            {name}:
                        </Typography>
                        <Typography className={classes.details} variant="caption" >
                            {details}
                        </Typography>
                    </li>
                ))
            }
        </ol>
    )
}

export default withStyles(styles)(InfoList)

