// Component Imports
import Lha from '@views/lha/Lha'
import Temuan from '@views/temuan/Temuan'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Temuan Audit',
  description: 'Temuan Audit'
}

const TemuanPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Temuan mode={mode} />
}

export default TemuanPage
