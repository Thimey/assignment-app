import { action } from 'mobx'

import { saveConstraints } from '../data'

import constraintStore from '../stores/constraintStore'

export default action('saveConstraints', async () => {

    const constraints = constraintStore.getConstraintsForDb()

    saveConstraints(constraints)
})
