import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment, incrementByAmount } from '../store/counterSlice'


export default function AboutPage() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()


  return (
    <div>
      
      <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <input value={count} onChange={(e) => dispatch(incrementByAmount(e.target.value))} />
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <button onClick={() => dispatch(incrementByAmount(50))}>
          50 şer artır
        </button>

    </div>
  )
}
