import React from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './routes'
import ToastContainer from './components/ToastContainer'
import { ToastProvider } from './contexts/ToastContext'

const App: React.FC = () => {
  const element = useRoutes(routes)
  
  return (
    <ToastProvider>
      <div className="app">
        {element}
      </div>
      <ToastContainer />
    </ToastProvider>
  )
}

export default App