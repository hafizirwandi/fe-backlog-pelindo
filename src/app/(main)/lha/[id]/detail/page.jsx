import Detail from '@views/lha/Detail'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Detail LHA',
  description: 'Detail Lembar Hasil Audit'
}

const DetailLhaPage = async params => {
  const mode = await getServerMode()

  return <Detail mode={mode} />
}

export default DetailLhaPage
