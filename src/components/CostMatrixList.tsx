import * as React from 'react'
import classnames from 'classnames'

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { SavedCostMatrix } from '../data'

const styles = (theme : Theme) => createStyles({
    selected: {
        backgroundColor: theme.palette.secondary.light,
    }
})

export interface Props extends WithStyles<typeof styles> {
    selectedScheduleId : number | null
    costMatrices : SavedCostMatrix[]
    onCostMatrixClick : (costMatrixId : SavedCostMatrix['id']) => void
}

function CostMatrixList({
    classes,
    selectedScheduleId,
    costMatrices,
    onCostMatrixClick
} : Props) {
    return (
        <List>
            {
                costMatrices.map(costMatrix =>
                    <ListItem
                        classes={{
                            button: classnames({
                                [classes.selected]: selectedScheduleId === costMatrix.id
                            })
                        }}
                        button
                        key={costMatrix.id}
                        onClick={() => onCostMatrixClick(costMatrix.id)}
                    >
                        <ListItemText primary={costMatrix.name} />
                    </ListItem>
                )
            }
        </List>
    )
}

export default withStyles(styles)(CostMatrixList)
