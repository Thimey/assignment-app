import adam from '../assets/adam.png'
import albert from '../assets/albert.png'
import angelica from '../assets/angelica.png'
import brad from '../assets/brad.png'
import brett from '../assets/brett.png'
import chappo from '../assets/chappo.png'
import emma from '../assets/emma.png'
import garrad from '../assets/garrad.png'
import gav from '../assets/gav.png'
import ivan from '../assets/ivan.png'
import jakub from '../assets/jakub.png'
import jarren from '../assets/jarren.png'
import jason from '../assets/jason.png'
import jen from '../assets/jen.png'
import jon from '../assets/jon.png'
import joyce from '../assets/joyce.png'
import kirk from '../assets/kirk.png'
import line from '../assets/line.png'
import mark from '../assets/mark.png'
import marko from '../assets/marko.png'
import niek from '../assets/niek.png'
import noel from '../assets/noel.png'
import richie from '../assets/richie.png'
import sean from '../assets/sean.png'
import simon from '../assets/simon.png'
import tash from '../assets/tash.png'
import trent from '../assets/trent.png'
import van from '../assets/van.png'
import vinni from '../assets/vinni.png'
import winston from '../assets/winston.png'

import { Worker } from '../data'

export default function getPic(worker : Worker) {
    switch (worker.name) {
        case 'simon':
            return simon

        case 'marko':
            return marko

        case 'mark':
            return mark

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

        case 'jon':
            return jon

        case 'garrad':
            return garrad

        case 'ivan':
            return ivan

        case 'kirk':
            return kirk

        case 'albert':
            return albert

        case 'angelica':
            return angelica

        case 'brad':
            return brad

        case 'brett':
            return brett

        case 'gav':
            return gav

        case 'jakub':
            return jakub

        case 'jarren':
            return jarren

        case 'jason':
            return jason

        case 'jen':
            return jen

        case 'joyce':
            return joyce

        case 'line':
            return line

        case 'niek':
            return niek

        case 'richie':
            return richie

        case 'sean':
            return sean

        case 'tash':
            return tash

        case 'trent':
            return trent

        case 'winston':
            return winston

        default:
            return simon
    }
}