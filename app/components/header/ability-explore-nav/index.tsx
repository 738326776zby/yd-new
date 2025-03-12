'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiPlanetFill,
  RiPlanetLine,
} from '@remixicon/react'
import classNames from '@/utils/classnames'
type AbilityExploreNavProps = {
  className?: string
}

const AbilityExploreNav = ({
  className,
}: AbilityExploreNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'ability-explore'
  // 这里选择新建了一个资源的原因是不对之前的页面做污染
  return (
    <Link href="/ability-explore/apps" className={classNames(
      className, 'group',
      activated && 'bg-components-main-nav-nav-button-bg-active shadow-md',
      activated ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
    )}>
      {
        activated
          ? <span className='icon iconfont icon-reserved-fill mr-1'></span>
          : <span className='icon iconfont icon-reserved-line mr-1'></span>
      }
      平台能力探索
    </Link>
  )
}

export default AbilityExploreNav