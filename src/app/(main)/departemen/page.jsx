// Component Imports
import Departemen from '@/views/organisasi/Departemen'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Manajemen Departemen',
  description: 'Manajemen Departemen'
}

const DepartemenPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Departemen mode={mode} />
}

export default DepartemenPage
