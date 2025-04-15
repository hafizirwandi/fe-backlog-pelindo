// Component Imports
import Temuan from '@views/hasil-auditor/Temuan'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Feedback Auditor',
  description: 'Input Feedback Auditor'
}

const TemuanPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Temuan mode={mode} />
}

export default TemuanPage
