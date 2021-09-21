const currentTime = (time) => {
    var currentTime = time ? new Date(time) : new Date()
    currentTime.setUTCHours(currentTime.getHours() + 5)
    currentTime.setUTCMinutes(currentTime.getMinutes() + 30)
   // currentTime.setUTCHours(currentTime.getHours())
   // currentTime.setUTCMinutes(currentTime.getMinutes())
    return currentTime
}

module.exports = currentTime
