// MUI Imports
import { usePathname, useRouter } from 'next/navigation'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import verticalMenuData from '@data/navigation/verticalMenuData'

import VerticalNav, { Menu, MenuItem, MenuSection, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
import { useAuth } from '@/context/AuthContext'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  const { user, loadingUser } = useAuth()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar
  const pathname = usePathname()
  const router = useRouter()

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem activeUrls={['/home']} pathname={pathname} href='/home' icon={<i className='tabler-smart-home' />}>
          Home
        </MenuItem>
        {user?.permissions?.includes('read roles') && (
          <MenuItem
            activeUrls={['/roles', '/roles/*']}
            pathname={pathname} // Current path from router or context
            href='/roles'
            icon={<i className='tabler-rosette' />}
          >
            Roles
          </MenuItem>
        )}
        {user?.permissions?.includes('read users') && (
          <MenuItem
            prefix='Users'
            activeUrls={['/users', '/users/*']}
            pathname={pathname} // Current path from router or context
            href='/users'
            icon={<i className='tabler-users' />}
          ></MenuItem>
        )}
        {user?.permissions?.includes('read organisasi') && (
          <SubMenu label='Organisasi' icon={<i className='tabler-affiliate' />}>
            <MenuItem
              prefix='Unit'
              activeUrls={['/unit']}
              pathname={pathname} // Current path from router or context
              href='/unit'
            ></MenuItem>
            <MenuItem
              prefix='Divisi'
              activeUrls={['/divisi']}
              pathname={pathname} // Current path from router or context
              href='/divisi'
            ></MenuItem>
            <MenuItem
              prefix='Departemen'
              activeUrls={['/departemen']}
              pathname={pathname} // Current path from router or context
              href='/departemen'
            ></MenuItem>
            <MenuItem
              prefix='Jabatan'
              activeUrls={['/jabatan']}
              pathname={pathname} // Current path from router or context
              href='/jabatan'
            ></MenuItem>
          </SubMenu>
        )}
        {user?.permissions?.includes('read lha') && (
          <SubMenu label='LHA' icon={<i className='tabler-clipboard-text' />}>
            <MenuItem
              activeUrls={['/lha', `/lha/*`]}
              pathname={pathname} // Current path from router or context
              href='/lha'
            >
              List LHA
            </MenuItem>
            {/* <MenuItem
              activeUrls={['/lha/riwayat']}
              pathname={pathname} // Current path from router or context
              href='/lha/riwayat'
            >
              Riwayat
            </MenuItem> */}
          </SubMenu>
        )}
        {user?.permissions?.includes('read temuan') && (
          <MenuItem
            activeUrls={['/temuan', '/temuan/*']}
            pathname={pathname} // Current path from router or context
            href='/temuan'
            icon={<i className='tabler-building' />}
          >
            Temuan
          </MenuItem>
        )}
        {user?.permissions?.includes('read hasil-auditor') && (
          <MenuItem
            activeUrls={['/hasil-auditor']}
            pathname={pathname} // Current path from router or context
            href='/hasil-auditor'
            icon={<i className='tabler-clipboard-text' />}
          >
            Feedback Auditor
          </MenuItem>
        )}
        {user?.permissions?.includes('read report') && (
          <MenuItem
            activeUrls={['/report-findings']}
            pathname={pathname} // Current path from router or context
            href='/report-findings'
            icon={<i className='tabler-clipboard-text' />}
          >
            Report Findings
          </MenuItem>
        )}
        {user?.permissions?.includes('read audit') && (
          <MenuItem
            activeUrls={['/audit-trace', '/audit-trace/*']}
            pathname={pathname} // Current path from router or context
            href='/audit-trace'
            icon={<i className='tabler-devices-check' />}
          >
            Audit Trace
          </MenuItem>
        )}
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
