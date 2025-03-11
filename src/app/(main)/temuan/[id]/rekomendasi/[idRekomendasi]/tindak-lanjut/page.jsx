// Component Imports
import Rekomendasi from '@views/temuan/Rekomendasi'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import Tindaklanjut from '@/views/temuan/Tindaklanjut'

export const metadata = {
  title: 'Tindak lanjut rekomendasi temuan',
  description: 'Tindak lanjut rekomendasi temuan'
}

const TindakLanjutPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Tindaklanjut mode={mode} />
}

export default TindakLanjutPage
