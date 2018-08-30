import * as React from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core'

import CostMatrix from './views/CostMatrix'
import ScheduleMatrix from './views/ScheduleMatrix'

import {
    getWorkers,
    getTasks,
    getSchedules,
    Worker,
} from './data'

import taskStore from './stores/taskStore'
import scheduleStore from './stores/scheduleStore'

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
}

class App extends React.Component<WithStyles<typeof styles>, State> {
    state : State = {
        display: Display.schedule,
        workers: [],
    }

    componentDidMount() {
        this.getTasks()
        this.getWorkers()
        this.getSchedules()
    }

    private getWorkers = async () => this.setState({ workers: await getWorkers() })
    private getTasks = async () => taskStore.addTasks(await getTasks())
    private getSchedules = async () => scheduleStore.addSchedules(await getSchedules())

    public render() {
        const { display } = this.state
        return (
            <div className={this.props.classes.container}>

                {
                    display === Display.costMatrix &&
                    <CostMatrix
                        workers={this.state.workers}
                        tasks={taskStore.tasks as any}
                    />
                }

                {
                    display === Display.schedule &&
                    <ScheduleMatrix />
                }
            </div>
        )
    }
}

export default withStyles(styles)(App)
