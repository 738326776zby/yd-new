'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiHammerFill,
  RiHammerLine,
} from '@remixicon/react'
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

  return (
    <Link href="/evaluation/apps" className={classNames(
      'group text-sm font-medium',
      activated && 'font-semibold bg-components-main-nav-nav-button-bg-active hover:bg-components-main-nav-nav-button-bg-active-hover shadow-md',
      activated ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text hover:bg-components-main-nav-nav-button-bg-hover',
      className,
    )}>
      {
        activated
          ? <span className='icon iconfont icon-character-recognition-fill mr-1'></span>
          : <span className='icon iconfont icon-character-recognition-line mr-1'></span>
      }
     效果评测
    </Link>
  )
}

export default EvaluationsNav