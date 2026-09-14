import Dashboard from './components/Dashboard'
import { ActionButtons } from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Dashboard />
      <div className="px-6 pb-6">
        <ActionButtons />
      </div>
    </div>
  )
}

export default App
