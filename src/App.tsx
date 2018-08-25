import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import CostMatrix from './views/CostMatrix'

const styles = createStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
    }
})


class App extends React.Component<WithStyles<typeof styles>> {
    public render() {
      return (
            <div className={this.props.classes.container}>
                <CostMatrix />
            </div>
          )
    }
}

export default withStyles(styles)(App)
