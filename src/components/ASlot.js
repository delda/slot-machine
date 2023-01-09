import React, {useRef, useState, useEffect} from 'react'
import {findDOMNode} from "react-dom"
import jsonList from "./phrase.json";
import classNames from "classnames";

export default function ASlot(props, ref) {
    const targetRefs = []
    const duration = props.duration
    let startTime = Date.now()
    const slotFrame = useRef()
    const fullScroll = useRef(0)
    const totalScroll = useRef(0)

    useEffect(() => {
        if (props.newItem) {
            newItem()
        }
    }, [props.newItem])

    const easing = (elapsed, initialValue, amountOfChange, duration) => {
        return -amountOfChange * (elapsed /= duration) * (elapsed - 2) + initialValue
    }

    const onEnd = () => {
        console.log(this)
        console.log('End!')
    }

    const newItem = () => {
        console.log('%c [SW] turn!', 'background: blue; color: #fff; padding: 5px;')
        const frame = slotFrame.current
        frame.scrollTop = 0
        const target = findDOMNode(targetRefs[props.target])
        fullScroll.current = findDOMNode(targetRefs[targetRefs.length - 1]).offsetTop
        const targetOffset = target.offsetTop

        totalScroll.current = targetOffset + fullScroll.current * (props.times - 1)
        const startTime = Date.now()
        tick()
    }

    const tick = () => {
        const elapsed = Date.now() - startTime
        if (elapsed > duration) {
            onEnd()
            return
        }

        const amount = easing(elapsed, 0, totalScroll.current, duration)
        slotFrame.current.scrollTop = amount % fullScroll.current

        requestAnimationFrame(tick)
    }

    return (
        <div
            id={props.id}
            ref={slotFrame}
        >
            {props.children.map((child, index) =>
                React.cloneElement(child, { ref: ref => (targetRefs[index] = ref) }))}
        </div>
    )
}