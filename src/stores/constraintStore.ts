import { action, observable, IObservableArray, toJS } from 'mobx'

import { ConstraintType, Constraints } from '../solver'
import transformConstraints from '../lib/tranformConstraints'

import {
    SavedMustCannotWorkConstraint,
    SavedConstraintBase,
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

    @action.bound
    public deleteConstraint(type : ConstraintType, index : number) {
        if (type === ConstraintType.mustWork) {
            this.mustWorkConstraints.replace(this.mustWorkConstraints.filter((_, i) => i !== index))
        } else if (type === ConstraintType.cannotWork) {
            this.cannotWorkConstraints.replace(this.cannotWorkConstraints.filter((_, i) => i !== index))
        }
    }

    private filterDisabled = ({ disabled } : SavedConstraintBase) => !disabled

    private prepareConstraintsForSolver(constraints : SavedConstraintBase[]) {
        return transformConstraints(constraints.filter(this.filterDisabled))
    }

    public getConstraintsForSolver() : Constraints {
        return {
            mustWork: this.prepareConstraintsForSolver(toJS(this.mustWorkConstraints)) as any,
            cannotWork: this.prepareConstraintsForSolver(toJS(this.cannotWorkConstraints)) as any,
        }
    }

    public getConstraintsForDb() : Constraints {
        return {
            mustWork: toJS(this.mustWorkConstraints) as any,
            cannotWork: toJS(this.cannotWorkConstraints) as any,
        }
    }
}


const instance = new ConstraintStore()

export default instance
