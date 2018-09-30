import { action, observable, IObservableArray, toJS } from 'mobx'

import { ConstraintType, Constraints } from '../solver'
import {
    transformMustCannotAtLeastConstraints,
    transformTimeFatigueTotalConstraints,
    transformOverallTimeFatigueTotalConstraints,
    transformConsecutiveFatigueConstraints,
    transformUnavailableConstraints,
    transformBuddyNemesisConstraints,
} from '../lib/transformConstraints'

import {
    SavedMustCannotWorkConstraint,
    SavedTimeFatigueTotalConstraint,
    SavedOverallTimeFatigueTotalConstraint,
    SavedOverallTimeFatigueConsecutiveConstraint,
    SavedAtLeastWorkConstraint,
    SavedConstraintBase,
    SavedConstraints,
    SavedBuddyNemesisConstraint,
    SavedUnavailableConstraint,
} from '../data'

class ConstraintStore {
    public mustWorkConstraints : IObservableArray<SavedMustCannotWorkConstraint> = observable([])
    public cannotWorkConstraints : IObservableArray<SavedMustCannotWorkConstraint> = observable([])
    public atLeastWorkConstraints : IObservableArray<SavedAtLeastWorkConstraint> = observable([])
    public timeFatigueTotalConstraints : IObservableArray<SavedTimeFatigueTotalConstraint> = observable([])
    public overallTimeFatigueTotalConstraints : IObservableArray<SavedOverallTimeFatigueTotalConstraint> = observable([])
    public overallTimeFatigueConsecutiveConstraints : IObservableArray<SavedOverallTimeFatigueConsecutiveConstraint> = observable([])
    public unavailableConstraints : IObservableArray<SavedUnavailableConstraint> = observable([])
    public buddyConstraints : IObservableArray<SavedBuddyNemesisConstraint> = observable([])
    public nemesisConstraints : IObservableArray<SavedBuddyNemesisConstraint> = observable([])

    @action.bound
    public addConstraints(constraints : SavedConstraints) {
        this.mustWorkConstraints.replace(constraints.mustWork)
        this.cannotWorkConstraints.replace(constraints.cannotWork)
        this.atLeastWorkConstraints.replace(constraints.atLeastWork)
        this.timeFatigueTotalConstraints.replace(constraints.timeFatigueTotal)
        this.overallTimeFatigueTotalConstraints.replace(constraints.overallTimeFatigueTotal)
        this.overallTimeFatigueConsecutiveConstraints.replace(constraints.overallTimeFatigueConsecutive)
        this.unavailableConstraints.replace(constraints.unavailable)
        this.buddyConstraints.replace(constraints.buddy)
        this.nemesisConstraints.replace(constraints.nemesis)
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
        } else if (type === ConstraintType.unavailable) {
            this.unavailableConstraints[index] = data
        } else if (type === ConstraintType.buddy) {
            this.buddyConstraints[index] = data
        } else if (type === ConstraintType.nemesis) {
            this.nemesisConstraints[index] = data
        }
    }

    private setAllDisableEnable = (constraints : SavedConstraintBase[], disabled : boolean) => {
        return constraints.map(c => ({ ...c, disabled }))
    }

    @action.bound
    public disableEnableAllConstraints(newDisabled : boolean) {
        const newConstraints = {
            mustWork: this.setAllDisableEnable(this.mustWorkConstraints, newDisabled),
            cannotWork: this.setAllDisableEnable(this.cannotWorkConstraints, newDisabled),
            atLeastWork: this.setAllDisableEnable(this.atLeastWorkConstraints, newDisabled),
            timeFatigueTotal: this.setAllDisableEnable(this.timeFatigueTotalConstraints, newDisabled),
            overallTimeFatigueTotal: this.setAllDisableEnable(this.overallTimeFatigueTotalConstraints, newDisabled),
            overallTimeFatigueConsecutive: this.setAllDisableEnable(this.overallTimeFatigueConsecutiveConstraints, newDisabled),
            unavailable: this.setAllDisableEnable(this.unavailableConstraints, newDisabled),
            buddy: this.setAllDisableEnable(this.buddyConstraints, newDisabled),
            nemesis: this.setAllDisableEnable(this.nemesisConstraints, newDisabled),
        }

        this.addConstraints(newConstraints as any)
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
                breakTime: 15,
                disabled: false,
            })
        } else if (type === ConstraintType.unavailable) {
            this.unavailableConstraints.push({
                workers: [],
                range: {
                    startTime: { hour: 9, min: 0 },
                    endTime: { hour: 9, min: 0 },
                },
                disabled: false,
            })
        } else if (type === ConstraintType.buddy) {
            this.buddyConstraints.push({
                workers: [],
                tasks: [],
                disabled: false,
            })
        } else if (type === ConstraintType.nemesis) {
            this.nemesisConstraints.push({
                workers: [],
                tasks: [],
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
        } else if (type === ConstraintType.unavailable) {
            this.unavailableConstraints.replace(this.unavailableConstraints.filter((_, i) => i !== index))
        } else if (type === ConstraintType.buddy) {
            this.buddyConstraints.replace(this.buddyConstraints.filter((_, i) => i !== index))
        } else if (type === ConstraintType.nemesis) {
            this.nemesisConstraints.replace(this.nemesisConstraints.filter((_, i) => i !== index))
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
            unavailable: transformUnavailableConstraints(toJS(this.unavailableConstraints).filter(this.filterDisabled)) as any,
            buddy: transformBuddyNemesisConstraints(toJS(this.buddyConstraints).filter(this.filterDisabled)) as any,
            nemesis: transformBuddyNemesisConstraints(toJS(this.nemesisConstraints).filter(this.filterDisabled)) as any,
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
            unavailable: toJS(this.unavailableConstraints) as any,
            buddy: toJS(this.buddyConstraints) as any,
            nemesis: toJS(this.nemesisConstraints) as any,
        }
    }
}


const instance = new ConstraintStore()

export default instance
