// Component Imports

import Unit from '@views/organisasi/Unit'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Manajemen Unit',
  description: 'Manajemen Unit'
}

const UnitPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Unit mode={mode} />
}

export default UnitPage
