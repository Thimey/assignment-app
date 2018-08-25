import * as React from 'react'
import Matrix from '../components/Matrix'

const data = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
]

const data2 = [
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
    [1],
]

import { createStyles, withStyles, WithStyles } from '@material-ui/core'

const styles = createStyles({
    container: {
        height: '80%',
        width: '80%',
        border: `${2}px solid`,
    }
})

class CostMatrix extends React.Component<WithStyles<typeof styles>> {
    private renderCell = (x : any) => <div>{x}</div>

    public render() {
        return (
            <div className={this.props.classes.container}>
                <Matrix
                    cells={data}
                    colHeaders={data[0]}
                    rowHeaders={data2}
                    renderCell={this.renderCell}
                    renderColHeader={this.renderCell}
                    renderRowHeader={this.renderCell}
                />
            </div>
        )
    }
}

export default withStyles(styles)(CostMatrix)
