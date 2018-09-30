import * as React from 'react'

import { createStyles, withStyles, WithStyles } from '@material-ui/core'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/Info'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import { SolveOption } from '../../solver'
import InfoList from '../../components/InfoList'

const styles = createStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    infoContainer: {},
    iconContainer: {
        marginRight: '8px',
    },
    infoHeader: {
        display: 'flex',
        alignItems: 'center',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
        marginTop: '20px',
    },
})

export interface Props extends WithStyles<typeof styles> {
    selectedSolution : SolveOption
    onSolutionOptionSelect : (option : SolveOption) => void
    timeLimit : number
    onTimeLimitChange : (timeLimit : number | null) => void
}

const info = [
    {
        name: 'No optimisation',
        details: 'This is the quickest option. The solver will return the first feasible solution.',
    },
    {
        name: 'Optimise (recommended)',
        details: 'This will use the given cost matrix to optimise the solution. This option requires a time limit which will be used terminate the solver if optimal solution not already found. Upon termination, the best found solution is returned',
    },
    {
        name: 'Optimal',
        details: 'This will explore the entire (feasible) search tree and return the best solution! Warning; takes ages if many workers/tasks',
    },
]

function SolverOptions({
    classes,
    onSolutionOptionSelect,
    selectedSolution,
    timeLimit,
    onTimeLimitChange,
} : Props) {
    const handleSolutionOptionSelect = (e : any) => {
        onSolutionOptionSelect(e.target.value)
    }

    const handleTimeLimitChange = (e : any) => {
        onTimeLimitChange(parseInt(e.target.value, 10))
    }

    const handleTimeLimitSwitch = (e : any) => {
        onTimeLimitChange(
            e.target.checked
                ? 1
                : null
        )
    }

    return (
        <div className={classes.container}>
            <div className={classes.infoContainer}>

                <div className={classes.infoHeader}>
                    <InfoIcon className={classes.iconContainer} />
                    <Typography variant="body1">
                        The solver options dictate the speed and quality of the solution.
                    </Typography>
                </div>

                <InfoList
                    info={info}
                />
            </div>

            <div className={classes.inputContainer}>
                <Select
                    value={selectedSolution}
                    onChange={handleSolutionOptionSelect}
                >
                    <MenuItem value={SolveOption.noOptimisation}>No optimisation</MenuItem>
                    <MenuItem value={SolveOption.optimise}>Optimise</MenuItem>
                    <MenuItem value={SolveOption.optimal}>Optimal!</MenuItem>
                </Select>

                <br/>

                {
                    selectedSolution !== SolveOption.noOptimisation &&
                    <div>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={timeLimit !== null}
                                    onChange={handleTimeLimitSwitch}
                                    value="timelimit"
                                    color="primary"
                                />
                            }
                            label="Time limit"
                        />

                        {
                            timeLimit !== null &&
                            <TextField
                                type="number"
                                inputProps={{
                                    min: 1,
                                }}
                                onChange={handleTimeLimitChange}
                                value={timeLimit}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">mins</InputAdornment>,
                                }}
                            />
                        }
                    </div>
                }

            </div>

        </div>
    )
}

export default withStyles(styles)(SolverOptions)
