import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import CostMatrix from './views/CostMatrix'

import {
    getWorkers,
    getTasks,
    Worker,
    Task,
} from './data'


const styles = createStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
    }
})

export interface State {
    workers : Worker[],
    tasks : Task[]
}


class App extends React.Component<WithStyles<typeof styles>, State> {
    state = {
        workers: [],
        tasks: []
    }
    componentDidMount() {
        this.getTasks()
        this.getWorkers()
    }

    private getWorkers = async () => this.setState({ workers: await getWorkers() })
    private getTasks = async () => this.setState({ tasks: await getTasks() })


    public render() {
      return (
            <div className={this.props.classes.container}>
                <CostMatrix
                    workers={this.state.workers}
                    tasks={this.state.tasks}
                />
            </div>
          )
    }
}

export default withStyles(styles)(App)
