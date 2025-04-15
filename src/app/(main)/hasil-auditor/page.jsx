// Component Imports
import Lha from '@views/hasil-auditor/Lha'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Feedback Auditor',
  description: 'Input Feedback Auditor'
}

const TemuanPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Lha mode={mode} />
}

export default TemuanPage
