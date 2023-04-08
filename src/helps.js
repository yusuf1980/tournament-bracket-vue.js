
export const dateNow = (slash = '/') => {
    let d = new Date()
    let date = d.getFullYear() + slash + ('0'+ (d.getMonth()+1)).slice(-2) + slash + ('0' + d.getDate()).slice(-2)
    return date
}

export const arrayMaxId = (arr) => {
    let len = arr.length
    let max = -Infinity
    while (len--) {
        if(arr[len].id > max) {
            max = arr[len].id
        }
    }
    return max
}

export const arrayMaxOrder = (arr) => {
    let len = arr.length
    let max = -Infinity
    while (len--) {
        if(arr[len].order > max) {
            max = arr[len].order
        }
    }
    return max
}

