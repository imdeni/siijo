import React from 'react'

export default function Alert(
    { children, variant, icon = 'mdi mdi-information' }: Readonly<{
        children: React.ReactNode,
        variant: 'primary' | 'success' | 'danger' | 'warning' | 'info',
        icon?: string
    }>
) {
    let bgColor = 'bg-sky-50'
    let textColor = 'text-sky-500'
    let borderColor = 'border border-sky-300'
    if (variant === 'success') {
        bgColor = 'bg-success-50'
        textColor = 'text-success-500'
        borderColor = 'border border-success-300'
    } else if (variant === 'danger') {
        bgColor = 'bg-danger-50'
        textColor = 'text-danger-500'
        borderColor = 'border border-danger-300'
    } else if (variant === 'warning') {
        bgColor = 'bg-warning-50'
        textColor = 'text-warning-500'
        borderColor = 'border border-warning-300'
    } else if (variant === 'info') {
        bgColor = 'bg-cyan-50'
        textColor = 'text-cyan-500'
        borderColor = 'border border-cyan-300'
    }

    return (
        <div className={`flex flex-row items-center px-5 py-3 rounded-xl ${bgColor} ${borderColor}`}>
            <span className={`mr-3 text-xl ${icon} ${textColor}`}></span>
            <div className={`${textColor}`}>{children}</div>
        </div>
    )
}
