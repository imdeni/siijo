import { format, formatDistanceStrict, parse } from "date-fns"

export const formatDate = (date: string, pattern: string) => {
    if (date) {
        return format(new Date(date), pattern)
    } else {
        return ''
    }
}

export const formatTime = (time: any, newPattern: any, oldPattern = 'HH:mm:ss') => {
    return time ? format(parse(time, oldPattern, new Date()), newPattern) : '-'
}

export const formatTimeDistance = (startTime: string, endTime: string, oldPattern = 'HH:mm:ss') => {
    return startTime && endTime ? formatDistanceStrict(parse(startTime, oldPattern, new Date()), parse(endTime, oldPattern, new Date())) : '-'
}

export const strTitle = (string: string) => {
    return string ? string.replace(/_/g, ' ').replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    }) : null;
}

export const strSnake = (string: string) => {
    return string ? string.replace(/-/g, '_').toLowerCase() : null;
}

export const strHeadline = (string: string) => {
    return string ? string.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ') : null
}

export const strInitials = (string: string) => {
    let initials = '';
    string.split(' ').forEach(word => {
        if (word.charAt(0) === word.charAt(0).toUpperCase() && initials.length < 2) {
            initials += word.charAt(0);
        }
    });
    return initials;
}