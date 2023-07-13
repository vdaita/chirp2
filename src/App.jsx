import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import Authentication from './pages/Authentication'
import Home from './pages/Home'

import { ChakraProvider } from '@chakra-ui/react'
import { supabase } from './supabaseClient';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Home/>
  )
}

export default App
