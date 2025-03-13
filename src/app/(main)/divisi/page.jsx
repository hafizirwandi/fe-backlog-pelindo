// Component Imports

import Divisi from '@views/organisasi/Divisi'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Manajemen Divisi',
  description: 'Manajemen Divisi'
}

const DivisiPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Divisi mode={mode} />
}

export default DivisiPage
