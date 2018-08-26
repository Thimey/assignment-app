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
})

export interface IProps<T> extends WithStyles {
    renderCell : (cellData : T) => JSX.Element | null
    renderHeader : (cellData : T) => JSX.Element | null
    cells : T[][]
    headers : any[]
    onScroll : (scrollTop : number) => void
    scrollTop : number
    cellContentHeightPx : number
    cellHeaderHeightPx : number
    cellWidthPx : number
}

export class MatrixContent<T> extends React.Component<IProps<T>> {
    private scrollEl : HTMLElement | null = null

    componentWillReceiveProps(newProps : IProps<T>) {
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

    private renderCell = (cellData : T) => {
        return (
            <div
                style={this.cellContentContainerDimensions}
                className={this.props.classes.cellContainer}
            >
                {
                    this.props.renderCell(cellData)
                }
            </div>
        )
    }

    private renderHeaderCell = (headerData : any) => {
        return (
            <div
                style={this.cellHeaderContainerDimensions}
                className={this.props.classes.headerCellContainer}
            >
                {
                    this.props.renderHeader(headerData)
                }
            </div>
        )
    }


    private renderRow = (row : T[]) => {
        return (
            <div className={this.props.classes.rowContainer}>
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
