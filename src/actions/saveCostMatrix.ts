import { action } from 'mobx'

import { saveCostMatrix, SavedCostMatrix } from '../data'

import costStore from '../stores/costStore'

export default action('saveCostMatrix', async (payload : Partial<SavedCostMatrix>) => {

    const resp = await saveCostMatrix(payload)

    costStore.addCostMatrices([resp])
})
