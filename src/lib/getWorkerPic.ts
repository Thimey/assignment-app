import simon from '../assets/simon.png'
import marko from '../assets/marko.png'
import adam from '../assets/adam.png'
import noel from '../assets/noel.png'
import chappo from '../assets/chappo.png'
import emma from '../assets/emma.png'
import van from '../assets/van.png'
import vinni from '../assets/vinni.png'

import { Worker } from '../data'

export default function getPic(worker : Worker) {
    switch (worker.name) {
        case 'simon':
            return simon

        case 'marko':
            return marko

        case 'noel':
            return noel

        case 'adam':
            return adam

        case 'chappo':
            return chappo

        case 'emma':
            return emma

        case 'van':
            return van

        case 'vinni':
            return vinni

        default:
            return simon
    }
}