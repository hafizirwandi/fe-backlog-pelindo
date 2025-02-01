const verticalMenuData = [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Users',
    href: '/users',
    icon: 'tabler-users'
  },
  {
    label: 'Users',
    href: '/users/add',
    icon: 'tabler-users'
  },
  {
    label: 'Roles & Permisison',
    href: '/roles',
    icon: 'tabler-settings'
  },
  {
    label: 'Positions',
    href: '/posiitons',
    icon: 'tabler-section'
  },
  {
    label: 'Units & Divisions',
    icon: 'tabler-universe',
    children: [
      {
        label: 'Units',
        href: '/units'
      },
      {
        label: 'Division',
        href: '/divisions'
      }
    ]
  },

  {
    label: 'About',
    href: '/about',
    icon: 'tabler-info-circle'
  }
]

export default verticalMenuData
