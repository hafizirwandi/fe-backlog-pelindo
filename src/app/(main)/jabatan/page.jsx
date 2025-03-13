// Component Imports
import Jabatan from '@/views/organisasi/Jabatan'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Manajemen Unit',
  description: 'Manajemen Unit'
}

const UnitPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Jabatan mode={mode} />
}

export default UnitPage
