import React from 'react'

export default function Rating({ size = 'md', onValueChange, value = 0, readonly = false }: {
    readonly size?: string,
    readonly onValueChange?: (value: number) => void,
    readonly value?: number,
    readonly readonly?: boolean
}) {
    const [hover, setHover] = React.useState(0)

    const onPointerLeave = () => {
        if (value === 0) {
            setHover(0)
        } else {
            setHover(value)
        }
    }

    const onPointerEnter = (index: number) => {
        setHover(index + 1)
    }

    const onClick = (index: number) => {
        onValueChange?.(index + 1)
    }

    React.useEffect(() => {
        if (value === 0) {
            setHover(0)
        } else {
            setHover(value)
        }
    }, [value])

    return (
        <div className='flex flex-row'>

            {readonly ? (
                [...Array(5)].map((_, index) => (
                    <span key={index}
                        className={`mdi mdi-${hover <= index ? 'star-outline' : 'star'} text-yellow-400 text-${size}`}></span>
                ))
            ) : (
                [...Array(5)].map((_, index) => (
                    <span key={index}
                        onClick={() => onClick(index)}
                        onPointerLeave={onPointerLeave}
                        onPointerEnter={() => onPointerEnter(index)}
                        className={`mdi mdi-${hover <= index ? 'star-outline' : 'star'} cursor-pointer text-yellow-400 text-${size}`}></span>
                ))
            )
            }
        </div >
    )
}
