import * as React from 'react'
import { createStyles, withStyles, WithStyles, Typography } from '@material-ui/core'

import chrome from '../assets/chrome.png'

const styles = createStyles({
    container: {
        display: 'flex',
    },
    chromeIcon: {
        width: 45,
        height: 45,
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '8px',
    },
    message1: {
        fontWeight: 'bold'
    }

})

export interface Props extends WithStyles<typeof styles> {

}

function GitubNotification({
    classes
} : Props) {

    return (
        <div className={classes.container}>
            <img className={classes.chromeIcon} src={chrome} />
            <div className={classes.messageContainer}>
                <Typography className={classes.message1}>
                    Github notification
                </Typography>

                <Typography>
                    Adam Hannigan - Pushed 1 new change to simon's demo
                </Typography>
            </div>
        </div>
    )
}

export default withStyles(styles)(GitubNotification)
