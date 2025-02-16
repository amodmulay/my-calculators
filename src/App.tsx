import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CompoundingCalculator from './components/CompoundingCalculator/CompoundingCalculator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <CompoundingCalculator />
      </div>
      <p className="read-the-docs">
        Under development...
      </p>
    </>
  )
}

export default App
