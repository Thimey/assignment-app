import { action, observable, IObservableArray } from 'mobx'

import { ConstraintType } from '../solver'

import {
    SavedMustCannotWorkConstraint
} from '../data'

class ConstraintStore {
    public mustWorkConstraints : IObservableArray<SavedMustCannotWorkConstraint> = observable([])

    @action.bound
    public addConstraints(constraints : any) {
        this.mustWorkConstraints.replace(constraints.mustWork)
        console.log(this.mustWorkConstraints)
    }

    @action.bound
    public updateConstraint(type : ConstraintType, index : number, data : any) {
        if (type === ConstraintType.mustWork) {
            this.mustWorkConstraints[index] = data
        }
    }
}


const instance = new ConstraintStore()

export default instance
