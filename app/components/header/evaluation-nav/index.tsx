'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useState } from 'react'
import { useSelectedLayoutSegment } from 'next/navigation'
import Nav from '../nav'
import {
  RiHammerFill,
  RiHammerLine,
} from '@remixicon/react'
import { type NavItem } from '../nav/nav-selector'
import classNames from '@/utils/classnames'
type EvaluationsNavProps = {
  className?: string
}

const EvaluationsNav = ({
  className,
}: EvaluationsNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment?.includes('evaluation')
  const [navItems, setNavItems] = useState<NavItem[]>([])

  return (
    <Nav
        isApp
        icon={<span className='icon iconfont icon-character-recognition-line'></span>}
        activeIcon={<span className='icon iconfont icon-character-recognition-fill'></span>}
        text={"效果评测"}
        activeSegment={['evaluation']}
        link='/evaluation/apps'
        // curNav={appDetail}
        navs={navItems}
        createText="效果评测"
        // onCreate={openModal}
        // onLoadmore={handleLoadmore}
      />
  )
}

export default EvaluationsNav