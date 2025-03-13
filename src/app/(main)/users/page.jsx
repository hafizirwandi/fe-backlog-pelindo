// Component Imports
import Users from '@/views/users/Users'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Manajemen Pengguna',
  description: 'Manajemen Pengguna'
}

const UnitPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Users mode={mode} />
}

export default UnitPage
