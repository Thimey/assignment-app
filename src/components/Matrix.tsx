import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import MatrixBase, { BaseProps as MatrixBaseProps } from '../components/MatrixBase'

export * from './MatrixBase'

const MATRIX_BORDER_PX = 2

const styles = createStyles({
    container: {
        width: `calc(100% - ${MATRIX_BORDER_PX}px)`,
        height: `calc(100% - ${MATRIX_BORDER_PX}px)`,
        display: 'flex',
    },
    matrix1Container: {
    },
    matrix2Container: {
    },
})

export interface IProps<T, U, P> extends MatrixBaseProps<T>, WithStyles<typeof styles> {
    rowHeaders : U[]
    colHeaders : P[]
    renderRowHeader : (data : U) => JSX.Element | null
    renderColHeader : (data : P) => JSX.Element | null
    renderCorner : () => JSX.Element
}

export interface IState {
    scrollTop : number
}

export class CostMatrix<T, U, P> extends React.Component<IProps<T, U, P>, IState> {
    state = { scrollTop: 0 }

    private onScroll = (scrollTop : number) => this.setState({ scrollTop })

    public render() {
        const {
            classes,
            cells,
            rowHeaders,
            colHeaders,
            renderCell,
            renderColHeader,
            renderRowHeader,
            renderOverlay,
            cellOverlays,
            cellWidthPx,
            cellHeaderHeightPx,
            cellContentHeightPx,
            renderCorner,
        } = this.props

        return (
            <div className={classes.container}>

                <div className={classes.matrix1Container}>
                    <MatrixBase
                        onScroll={this.onScroll}
                        scrollTop={this.state.scrollTop}
                        cells={rowHeaders.map(r => [r])}
                        headers={[0]}
                        renderCell={renderRowHeader}
                        renderHeader={renderCorner}
                        cellWidthPx={cellWidthPx}
                        cellHeaderHeightPx={cellHeaderHeightPx}
                        cellContentHeightPx={cellContentHeightPx}
                    />
                </div>

                <div style={{ width: `calc(100% - ${cellWidthPx}px)` }}>
                    <MatrixBase
                        onScroll={this.onScroll}
                        scrollTop={this.state.scrollTop}
                        cells={cells}
                        headers={colHeaders}
                        renderCell={renderCell}
                        renderHeader={renderColHeader}
                        cellWidthPx={cellWidthPx}
                        cellHeaderHeightPx={cellHeaderHeightPx}
                        cellContentHeightPx={cellContentHeightPx}
                        renderOverlay={renderOverlay}
                        cellOverlays={cellOverlays}
                    />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(CostMatrix)
