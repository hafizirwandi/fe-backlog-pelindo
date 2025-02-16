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

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

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
        <MenuItem
          activeUrls={['/roles', '/roles/*']}
          pathname={pathname} // Current path from router or context
          href='/roles'
          icon={<i className='tabler-rosette' />}
        >
          Roles
        </MenuItem>

        <MenuItem
          prefix='Users'
          activeUrls={['/users', '/users/*']}
          pathname={pathname} // Current path from router or context
          href='/users'
          icon={<i className='tabler-users' />}
        ></MenuItem>

        <MenuItem
          activeUrls={['/lha', '/lha/*']}
          pathname={pathname} // Current path from router or context
          href='/lha'
          icon={<i className='tabler-clipboard-text' />}
        >
          LHA
        </MenuItem>
        <MenuItem
          activeUrls={['/findings', '/findings/*']}
          pathname={pathname} // Current path from router or context
          href='/findings'
          icon={<i className='tabler-building' />}
        >
          Findings
        </MenuItem>
        <MenuItem
          activeUrls={['/report-findings']}
          pathname={pathname} // Current path from router or context
          href='/report-findings'
          icon={<i className='tabler-clipboard-text' />}
        >
          Report Findings
        </MenuItem>
        <MenuItem
          activeUrls={['/audit-trace', '/audit-trace/*']}
          pathname={pathname} // Current path from router or context
          href='/audit-trace'
          icon={<i className='tabler-devices-check' />}
        >
          Audit Trace
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
