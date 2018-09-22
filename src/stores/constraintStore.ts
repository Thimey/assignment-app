import { action, observable, IObservableArray, toJS } from 'mobx'

import { ConstraintType, Constraints } from '../solver'
import {
    transformMustCannotAtLeastConstraints,
    transformTimeFatigueTotalConstraints,
    transformOverallTimeFatigueTotalConstraints,
    transformConsecutiveFatigueConstraints,
} from '../lib/transformConstraints'

import {
    SavedMustCannotWorkConstraint,
    SavedTimeFatigueTotalConstraint,
    SavedOverallTimeFatigueTotalConstraint,
    SavedOverallTimeFatigueConsecutiveConstraint,
    SavedAtLeastWorkConstraint,
    SavedConstraintBase,
    SavedConstraints,
} from '../data'

class ConstraintStore {
    public mustWorkConstraints : IObservableArray<SavedMustCannotWorkConstraint> = observable([])
    public cannotWorkConstraints : IObservableArray<SavedMustCannotWorkConstraint> = observable([])
    public atLeastWorkConstraints : IObservableArray<SavedAtLeastWorkConstraint> = observable([])
    public timeFatigueTotalConstraints : IObservableArray<SavedTimeFatigueTotalConstraint> = observable([])
    public overallTimeFatigueTotalConstraints : IObservableArray<SavedOverallTimeFatigueTotalConstraint> = observable([])
    public overallTimeFatigueConsecutiveConstraints : IObservableArray<SavedOverallTimeFatigueConsecutiveConstraint> = observable([])

    @action.bound
    public addConstraints(constraints : SavedConstraints) {
        this.mustWorkConstraints.replace(constraints.mustWork)
        this.cannotWorkConstraints.replace(constraints.cannotWork)
        this.atLeastWorkConstraints.replace(constraints.atLeastWork)
        this.timeFatigueTotalConstraints.replace(constraints.timeFatigueTotal)
        this.overallTimeFatigueTotalConstraints.replace(constraints.overallTimeFatigueTotal)
        this.overallTimeFatigueConsecutiveConstraints.replace(constraints.overallTimeFatigueConsecutive)
    }

    @action.bound
    public updateConstraint(type : ConstraintType, index : number, data : any) {
        if (type === ConstraintType.mustWork) {
            this.mustWorkConstraints[index] = data
        } else if (type === ConstraintType.cannotWork) {
            this.cannotWorkConstraints[index] = data
        } else if (type === ConstraintType.atLeastWork) {
            this.atLeastWorkConstraints[index] = data
        } else if (type === ConstraintType.timeFatigueTotal) {
            this.timeFatigueTotalConstraints[index] = data
        } else if (type === ConstraintType.overallTimeFatigueTotal) {
            this.overallTimeFatigueTotalConstraints[index] = data
        } else if (type === ConstraintType.overallTimeFatigueConsecutive) {
            this.overallTimeFatigueConsecutiveConstraints[index] = data
        }
    }

    @action.bound
    public addNewConstraint(type : ConstraintType) {
        if (type === ConstraintType.mustWork) {
            this.mustWorkConstraints.push({
                workers: [],
                tasks: [],
                disabled: false,
            })
        } else if (type === ConstraintType.cannotWork) {
            this.cannotWorkConstraints.push({
                workers: [],
                tasks: [],
                disabled: false,
            })
        } else if (type === ConstraintType.atLeastWork) {
            this.atLeastWorkConstraints.push({
                workers: [],
                tasks: [],
                disabled: false,
            })
        } else if (type === ConstraintType.timeFatigueTotal) {
            this.timeFatigueTotalConstraints.push({
                workers: [],
                tasks: [],
                limit: 30,
                disabled: false,
            })
        } else if (type === ConstraintType.overallTimeFatigueTotal) {
            this.overallTimeFatigueTotalConstraints.push({
                workers: [],
                limit: 30,
                disabled: false,
            })
        } else if (type === ConstraintType.overallTimeFatigueConsecutive) {
            this.overallTimeFatigueConsecutiveConstraints.push({
                workers: [],
                limit: 30,
                disabled: false,
            })
        }
    }

    @action.bound
    public deleteConstraint(type : ConstraintType, index : number) {
        if (type === ConstraintType.mustWork) {
            this.mustWorkConstraints.replace(this.mustWorkConstraints.filter((_, i) => i !== index))
        } else if (type === ConstraintType.cannotWork) {
            this.cannotWorkConstraints.replace(this.cannotWorkConstraints.filter((_, i) => i !== index))
        } else if (type === ConstraintType.atLeastWork) {
            this.atLeastWorkConstraints.replace(this.atLeastWorkConstraints.filter((_, i) => i !== index))
        } else if (type === ConstraintType.timeFatigueTotal) {
            this.timeFatigueTotalConstraints.replace(this.timeFatigueTotalConstraints.filter((_, i) => i !== index))
        } else if (type === ConstraintType.overallTimeFatigueTotal) {
            this.overallTimeFatigueTotalConstraints.replace(this.overallTimeFatigueTotalConstraints.filter((_, i) => i !== index))
        } else if (type === ConstraintType.overallTimeFatigueConsecutive) {
            this.overallTimeFatigueConsecutiveConstraints.replace(this.overallTimeFatigueConsecutiveConstraints.filter((_, i) => i !== index))
        }
    }

    private filterDisabled = ({ disabled } : SavedConstraintBase) => !disabled

    public getConstraintsForSolver() : Constraints {
        return {
            mustWork: transformMustCannotAtLeastConstraints(toJS(this.mustWorkConstraints).filter(this.filterDisabled)) as any,
            cannotWork: transformMustCannotAtLeastConstraints(toJS(this.cannotWorkConstraints).filter(this.filterDisabled)) as any,
            atLeastWork: transformMustCannotAtLeastConstraints(toJS(this.atLeastWorkConstraints).filter(this.filterDisabled)) as any,
            timeFatigueTotal: transformTimeFatigueTotalConstraints(toJS(this.timeFatigueTotalConstraints).filter(this.filterDisabled)) as any,
            overallTimeFatigueTotal: transformOverallTimeFatigueTotalConstraints(toJS(this.overallTimeFatigueTotalConstraints).filter(this.filterDisabled)) as any,
            overallTimeFatigueConsecutive: transformConsecutiveFatigueConstraints(toJS(this.overallTimeFatigueConsecutiveConstraints).filter(this.filterDisabled)) as any,
        }
    }

    public getConstraintsForDb() : SavedConstraints {
        return {
            mustWork: toJS(this.mustWorkConstraints) as any,
            cannotWork: toJS(this.cannotWorkConstraints) as any,
            atLeastWork: toJS(this.atLeastWorkConstraints) as any,
            timeFatigueTotal: toJS(this.timeFatigueTotalConstraints) as any,
            overallTimeFatigueTotal: toJS(this.overallTimeFatigueTotalConstraints) as any,
            overallTimeFatigueConsecutive: toJS(this.overallTimeFatigueConsecutiveConstraints) as any,
        }
    }
}


const instance = new ConstraintStore()

export default instance
