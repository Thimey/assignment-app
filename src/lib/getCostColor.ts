function  getCostColor(cost : number){
    const hue = ((1 - cost / 100) * 120).toString(10)

    return {
        backgroundColor: `hsl(${hue}, 100%, 50%)`,
    }
}

export default getCostColor
