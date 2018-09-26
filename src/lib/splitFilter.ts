export default function splitFilter(filter : string) {
    return filter === ''
        ? [filter]
        : filter
            .split(',')
            .map(f => f.trim())
            .filter(f => !!f)
}