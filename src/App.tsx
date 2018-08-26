import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import CostMatrix from './views/CostMatrix'
import ScheduleMatrix from './views/ScheduleMatrix'

import {
    getWorkers,
    getTasks,
    getSchedules,
    Schedule,
    Worker,
    Task,
} from './data'

export enum Display {
    costMatrix = 'costMatrix',
    schedule = 'schedule',
}

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
    display : Display
    workers : Worker[],
    tasks : Task[]
    schedules : Schedule[]
}


class App extends React.Component<WithStyles<typeof styles>, State> {
    state = {
        display: Display.schedule,
        workers: [],
        tasks: [],
        schedules: [],
    }

    componentDidMount() {
        this.getTasks()
        this.getWorkers()
        this.getSchedules()
    }

    private getWorkers = async () => this.setState({ workers: await getWorkers() })
    private getTasks = async () => this.setState({ tasks: await getTasks() })
    private getSchedules = async () => this.setState({ schedules: await getSchedules() })


    public render() {
        const { display } = this.state
        return (
            <div className={this.props.classes.container}>

                {
                    display === Display.costMatrix &&
                    <CostMatrix
                        workers={this.state.workers}
                        tasks={this.state.tasks}
                    />
                }

                {
                    display === Display.schedule &&
                    <ScheduleMatrix
                        schedules={this.state.schedules}
                        tasks={this.state.tasks}
                    />
                }
            </div>
        )
    }
}

export default withStyles(styles)(App)
