import React, { useState } from 'react'
import SlotTransition from "./SlotTransition";
import './App.css';
import classNames from "classnames";

const jsonList = require('./phrase.json')

export default function SlotMachine() {
    const [target, setTarget] = useState(1)
    const [timesRotation, ] = useState(1)
    const [duration, ] = useState(3000)
    const [newItem, setNewItem] = useState(0)
    const [triggered, setTriggered] = useState([0])

    const generateRandomIntegerInRange = (min, max, used) => {
        let random
        do {
            random = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (used.includes(random))
        return random
    }

    const delay = (time) => {
        return new Promise(resolve => setTimeout(resolve, time))
    }

    const animation = (event) => {
        const trigger = document.getElementById('slot-trigger')
        trigger.classList.add('animation')
        delay(2000).then(() => trigger.classList.remove('animation'))
        setNewItem((newItem) => newItem + 1)
    }

    return (
        <div id="slot-machine">
            <div id="slot-body" className="center">
                <div id="slot-title"></div>
                <div id="slot-block"></div>
                <div id="slot-box"></div>
                <div id="slot-trigger"
                    onClick={() => {
                        let trigger = generateRandomIntegerInRange(0, jsonList.length - 1, triggered);
                        setTarget(trigger);
                        triggered.push(trigger);
                        setTriggered(triggered);
                        animation(); }}
                >
                    <div className="arm-shadow" ></div>
                    <div className="arm">
                        <div className="knob"></div>
                    </div>
                    <div className="ring1">
                        <div className="shadow" style={{top: '0px', opacity: '0'}}></div>
                    </div>
                    <div className="ring2">
                        <div className="shadow" style={{top: '0px', 'opacity': '0'}}></div>
                    </div>
                </div>
                <SlotTransition
                    duration={duration}
                    rotations={timesRotation}
                    target={target}
                    id='slot-frame'
                    newItem={newItem}
                >
                    {jsonList.map(({ phrase, author, date }, index) => (
                        <div
                            key={index}
                            className={classNames("slot-item", date ? "" : "evergreen")}
                        >
                            <div className="tooBig">
                                {phrase.split("\n").map(function(char, index){
                                    return <p key={index}>{char}</p>
                                })}
                            </div>
                            <div className={classNames("date", date ? "" : "evergreen")} >
                                {date ? date : "evergreen"}
                            </div>
                        </div>
                    ))}
                </SlotTransition>
                <div className="slot-frame shadow"></div>
            </div>
        </div>
    )
}