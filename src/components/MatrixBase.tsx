import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'

export const CELL_WIDTH_PX = 200
export const HEADER_CELL_HEIGHT_PX = 100
export const CONTENT_CELL_HEIGHT_PX = 200

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
    contentContainer: {
        height: `calc(100% - ${HEADER_CELL_HEIGHT_PX}px)`,
    },
    headerContainer: {
        width: 'fit-content',
        zIndex: 2,
        backgroundColor: 'whitesmoke',
        position: 'sticky' as 'sticky',
        top: 0,
        display: 'flex'
    },
    rowContainer: {
        display: 'flex'
    },
    cellContainer: {
        flexShrink: 0,
        border: '1px solid',
        width: `${CELL_WIDTH_PX}px`,
        height: `${CONTENT_CELL_HEIGHT_PX}px`,
    },
    headerCellContainer: {
        flexShrink: 0,
        border: '1px solid',
        width: `${CELL_WIDTH_PX}px`,
        height: `${HEADER_CELL_HEIGHT_PX}px`,
    },
})

export interface IProps<T> extends WithStyles {
    renderCell : (cellData : T) => JSX.Element | null
    renderHeader : (cellData : T) => JSX.Element | null
    cells : T[][]
    headers : any[]
    onScroll : (scrollTop : number) => void
    scrollTop : number
}

export class MatrixContent<T> extends React.Component<IProps<T>> {
    private scrollEl : HTMLElement | null = null

    private assignScrollEl = (node : HTMLElement | null) => { this.scrollEl = node }

    private handleScroll = () => {
        if (this.scrollEl) {
            this.props.onScroll(this.scrollEl.scrollTop)
        }
    }

    componentWillReceiveProps(newProps : IProps<T>) {
        if (this.props.scrollTop !==  newProps.scrollTop && this.scrollEl) {
            this.scrollEl.scrollTop = newProps.scrollTop
        }
    }

    private renderCell = (cellData : T) => {
        return (
            <div className={this.props.classes.cellContainer}>
                {
                    this.props.renderCell(cellData)
                }
            </div>
        )
    }

    private renderHeaderCell = (headerData : any) => {
        return (
            <div className={this.props.classes.headerCellContainer}>
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
        const { classes, cells } = this.props

        return (
            <div
                ref={this.assignScrollEl}
                className={classes.container}
                onScroll={this.handleScroll}
            >

                {
                    this.renderHeader()
                }

                <div className={classes.contentContainer}>
                    {
                        cells.map(this.renderRow)
                    }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(MatrixContent)
