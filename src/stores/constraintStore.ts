import { action, observable, IObservableArray, computed } from 'mobx'

import { ConstraintType, Constraints } from '../solver'

import {
    SavedMustCannotWorkConstraint
} from '../data'

class ConstraintStore {
    public mustWorkConstraints : IObservableArray<SavedMustCannotWorkConstraint> = observable([])
    public cannotWorkConstraints : IObservableArray<SavedMustCannotWorkConstraint> = observable([])

    @action.bound
    public addConstraints(constraints : any) {
        this.mustWorkConstraints.replace(constraints.mustWork)
        this.cannotWorkConstraints.replace(constraints.cannotWork)
    }

    @action.bound
    public updateConstraint(type : ConstraintType, index : number, data : any) {
        if (type === ConstraintType.mustWork) {
            this.mustWorkConstraints[index] = data
        } else if (type === ConstraintType.cannotWork) {
            this.cannotWorkConstraints[index] = data
        }
    }

    @action.bound
    public addNewConstraint(type : ConstraintType, data : any) {
        if (type === ConstraintType.mustWork) {
            this.mustWorkConstraints.push(data)
        } else if (type === ConstraintType.cannotWork) {
            this.cannotWorkConstraints.push(data)
        }
    }

    @computed
    public getConstraintsForSolver() : Constraints {
        return {

        } as any
    }
}


const instance = new ConstraintStore()

export default instance
