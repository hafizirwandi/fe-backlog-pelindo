// Component Imports
import Rekomendasi from '@views/temuan/Rekomendasi'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Tindak lanjut rekomendasi temuan',
  description: 'Tindak lanjut rekomendasi temuan'
}

const TindakLanjutPage = async () => {
  // Vars
  const mode = await getServerMode()

  return
}

export default TindakLanjutPage
