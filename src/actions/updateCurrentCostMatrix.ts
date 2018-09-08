import { action } from 'mobx'

import { updateCostMatrix } from '../data'

import costStore from '../stores/costStore'

export default action('updateCurrentCostMatrix', async () => {
    if (!costStore.selectedCostMatrixId) {
        return
    }

    // Get the loaded matrix
    const currentCostMatrix = costStore.currentCostMatrix

    // Get the saved matrix details
    const savedCostMatrix = costStore.getSavedMatrix(costStore.selectedCostMatrixId)

    if (currentCostMatrix) {
        // save to db
        const resp = await updateCostMatrix(costStore.selectedCostMatrixId)({
            ...savedCostMatrix,
            costMatrix: { ...currentCostMatrix },
        })

        costStore.addCostMatrices([resp])
    } else {
        throw new Error('Could not find current cost matrix')
    }
})
