// Component Imports

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import Dashboard from '@/views/dashboard/Dashboard'

export const metadata = {
  title: 'LHA',
  description: 'Lembar Hasil Audit'
}

const DashboardPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Dashboard mode={mode} />
}

export default DashboardPage
