// Component Imports
import Lha from '@views/lha/Lha'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'LHA',
  description: 'Lembar Hasil Audit'
}

const LhaPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Lha mode={mode} />
}

export default LhaPage
