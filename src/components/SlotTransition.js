import React, {useRef, useEffect} from 'react'
import {findDOMNode} from "react-dom"

export default function SlotTransition(props, ref) {
    const targetRefs = []
    const duration = props.duration
    let startTime = Date.now()
    const slotFrame = useRef()
    const fullScroll = useRef(0)
    const totalScroll = useRef(0)
    const timesRotation = props.rotations

    useEffect(() => {
        if (props.newItem) {
            newItem()
        }
    }, [props.newItem])

    const sliding = (initialValue, finalValue, elapsed, duration) => {
        // -x^2 + 2x + 0 = 0 nostra equazione
        let percentage = elapsed / duration
        return -finalValue * percentage * (percentage - 2) + initialValue
    }

    const onEnd = () => {}

    const newItem = () => {
        const frame = slotFrame.current
        frame.scrollTop = 0
        const target = findDOMNode(targetRefs[props.target])
        fullScroll.current = findDOMNode(targetRefs[targetRefs.length - 1]).offsetTop
        const targetOffset = target.offsetTop

        totalScroll.current = targetOffset + fullScroll.current * (timesRotation - 1)
        tick()
    }

    const tick = () => {
        const elapsed = Date.now() - startTime
        if (elapsed > duration) {
            onEnd()
            return
        }

        const amount = sliding(0, totalScroll.current, elapsed, duration)
        slotFrame.current.scrollTop = amount % fullScroll.current

        requestAnimationFrame(tick)
    }

    return (
        <div
            id={props.id}
            ref={slotFrame}
        >
            <div className="slot-item evergreen">
                <div className="intro"><p>Tira la manovella!</p></div>
            </div>
            {props.children.map((child, index) =>
                React.cloneElement(child, { ref: ref => (targetRefs[index] = ref) }))}
        </div>
    )
}