import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'

export const styles = createStyles({
    container:  {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },
    contentContainer: {},
    headerContainer: {
        width: 'fit-content',
        zIndex: 2,
        backgroundColor: 'whitesmoke',
        position: 'sticky' as 'sticky',
        top: 0,
        display: 'flex',
        borderBottom: '1px solid',
    },
    rowContainer: {
        position: 'relative',
        width: 'fit-content',
        display: 'flex',
        borderTop: '1px solid',
    },
    cellContainer: {
        flexShrink: 0,
    },
    headerCellContainer: {
        flexShrink: 0,
    },
    overlay: {
        top: 0,
        height: '100%',
        position: 'absolute',
        backgroundColor: 'red',
    }
})

export interface Overlay {
    startPx : number
    withPx : number
    data : any
}

export interface BaseProps<T> {
    cells : T[][]
    cellOverlays ?: Overlay[][]
    renderOverlay ?: (overlay : Overlay) => JSX.Element

    renderCell : (cellData : T) => JSX.Element | null
    cellContentHeightPx : number
    cellHeaderHeightPx : number
    cellWidthPx : number
}

export interface Props<T> extends BaseProps<T>, WithStyles<typeof styles> {
    renderHeader : (cellData : T) => JSX.Element | null
    headers : any[]
    onScroll : (scrollTop : number) => void
    scrollTop : number
}

export class MatrixContent<T> extends React.Component<Props<T>> {
    private scrollEl : HTMLElement | null = null

    componentWillReceiveProps(newProps : Props<T>) {
        if (this.props.scrollTop !==  newProps.scrollTop && this.scrollEl) {
            this.scrollEl.scrollTop = newProps.scrollTop
        }
    }

    private get cellContentContainerDimensions() {
        return {
            height: `${this.props.cellContentHeightPx}px`,
            width: `${this.props.cellWidthPx}px`,
        }
    }

    private get cellHeaderContainerDimensions() {
        return {
            height: `${this.props.cellHeaderHeightPx}px`,
            width: `${this.props.cellWidthPx}px`,
        }
    }

    private assignScrollEl = (node : HTMLElement | null) => { this.scrollEl = node }

    private handleScroll = () => {
        if (this.scrollEl) {
            this.props.onScroll(this.scrollEl.scrollTop)
        }
    }

    private renderCell = (cellData : T, index : number) => {
        return (
            <div
                key={index}
                style={this.cellContentContainerDimensions}
                className={this.props.classes.cellContainer}
            >
                {
                    this.props.renderCell(cellData)
                }
            </div>
        )
    }

    private renderHeaderCell = (headerData : any, index : number) => {
        return (
            <div
                key={index}
                style={this.cellHeaderContainerDimensions}
                className={this.props.classes.headerCellContainer}
            >
                {
                    this.props.renderHeader(headerData)
                }
            </div>
        )
    }

    private renderOverlay = (overlay : Overlay, index : number) => {
        return (
            <div
                key={index}
                className={this.props.classes.overlay}
                style={{
                    left: overlay.startPx,
                    width: overlay.withPx,
                }}
            >
                {
                    this.props.renderOverlay &&
                    this.props.renderOverlay(overlay)
                }
            </div>
        )
    }

    private renderRow = (row : T[], index : number) => {
        const { classes, cellOverlays } = this.props
        return (
            <div key={index} className={classes.rowContainer}>
                {
                    cellOverlays && cellOverlays[index] &&
                    cellOverlays[index].map(this.renderOverlay)
                }

                {
                    row.map(this.renderCell)
                }
            </div>
        )
    }

    private renderHeader = () => {
        return (
            <div className={this.props.classes.headerContainer}>
                {
                    this.props.headers.map(this.renderHeaderCell)
                }
            </div>
        )
    }

    render() {
        const { classes, cells, cellHeaderHeightPx } = this.props

        return (
            <div
                ref={this.assignScrollEl}
                className={classes.container}
                onScroll={this.handleScroll}
            >

                {
                    this.renderHeader()
                }

                <div
                    style={{
                        height: `calc(100% - ${cellHeaderHeightPx}px)`,
                    }}
                    className={classes.contentContainer}
                >
                    {
                        cells.map(this.renderRow)
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(MatrixContent)
