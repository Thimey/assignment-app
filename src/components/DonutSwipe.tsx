import * as React from 'react'
import classnames from 'classnames'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Donut from '../assets/donut.png'
import DonutPath from '../assets/donut_path.png'

const WIDTH = 80
const DONUT_WIDTH = 30

const styles = createStyles({
    container: {
        position: 'relative',
        cursor: 'pointer'
    },
    donut: {
        transition: '0.7s all',
        position: 'absolute',
        width: `${DONUT_WIDTH}px`,
    },
    donutUnChecked: {
        left: 0,
    },
    donutChecked: {
        left: `${WIDTH - DONUT_WIDTH}px`
    },
    donutPath: {
        width: `${WIDTH}px`
    },

})

export interface Props extends WithStyles<typeof styles> {
    onChange: () => void
    checked : boolean
}

function DonutSwipe({
    classes,
    checked,
    onChange,
} : Props) {
    return (
        <div onClick={onChange} className={classes.container}>
            <img
                className={classnames(classes.donut, {
                    [classes.donutChecked]: checked,
                    [classes.donutUnChecked]: !checked,
                })} src={Donut} />

            <img
                className={classes.donutPath} src={DonutPath} />
        </div>
    )
}

export default withStyles(styles)(DonutSwipe)
