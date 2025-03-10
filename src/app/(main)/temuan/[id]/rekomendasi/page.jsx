// Component Imports
import Rekomendasi from '@views/temuan/Rekomendasi'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Rekomendasi Temuan',
  description: 'Rekomendasi Temuan'
}

const RekomendasiPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Rekomendasi mode={mode} />
}

export default RekomendasiPage
