import { middleware } from './midleware/auth'

export default middleware

export const config = {
  matcher: '/((?!_next/static|images|favicon.ico).*)'
}
