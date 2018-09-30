import * as React from 'react'
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button'

import allocate from '../actions/allocate'
import modelStore from '../stores/modelStore'
import scheduleStore from '../stores/scheduleStore'

const handleAllocate = () => {
    if (modelStore.canAllocate) {

        allocate({
            schedule: scheduleStore.selectedSchedule!,
            selectedWorkerIds: modelStore.selectedWorkerIds,
            solverOption: modelStore.selectedSolution,
            time: modelStore.timeLimit,
        })
    }
}

function AllocateButton() {
    return (
        <Button
            variant="raised"
            color="secondary"
            onClick={handleAllocate}
            disabled={!modelStore.canAllocate}
        >
            Allocate
        </Button>
    )
}

export default observer(AllocateButton)
