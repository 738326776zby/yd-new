'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiHammerFill,
  RiHammerLine,
} from '@remixicon/react'
import classNames from '@/utils/classnames'
type ToolsNavProps = {
  className?: string
}

const ToolsNav = ({
  className,
}: ToolsNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'tools'

  return (
    <Link href="/tools" className={classNames(
      'group text-sm font-medium',
      activated && 'font-semibold bg-components-main-nav-nav-button-bg-active hover:bg-components-main-nav-nav-button-bg-active-hover shadow-md',
      activated ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
      className,
    )}>
      {
        activated
          ? <span className='icon iconfont icon-stack-fill mr-1'></span>
          : <span className='icon iconfont icon-stack-line mr-1'></span>
      }
      工具自定义
    </Link>
  )
}

export default ToolsNav