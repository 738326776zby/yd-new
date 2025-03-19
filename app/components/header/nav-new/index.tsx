'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import type { INavSelectorProps } from './nav-selector'
import NavSelector from './nav-selector'
import classNames from '@/utils/classnames'
import { ArrowNarrowLeft } from '@/app/components/base/icons/src/vender/line/arrows'
import { useStore as useAppStore } from '@/app/components/app/store'
import { EvaluationRecord } from '@/models/evaluation'
import { useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from 'next/navigation'
type INavProps = {
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  text: string
  activeSegment: string | string[]
  link: string
  navs: EvaluationRecord[]
} & INavSelectorProps

const Nav = ({
  icon,
  activeIcon,
  text,
  activeSegment,
  link,
  navs,
}: INavProps) => {
  const setAppDetail = useAppStore(state => state.setAppDetail)
 
  const [hovered, setHovered] = useState(false)
  const segment = useSelectedLayoutSegment()
  const isActivated = Array.isArray(activeSegment) ? activeSegment.includes(segment!) : segment === activeSegment
 
  const pathname = usePathname()
  const showNav = pathname.includes('/evaluation/manage')
  return (
    <div className={`
      flex items-center h-8 mr-0 sm:mr-3 px-0.5 rounded-xl text-sm shrink-0 font-medium
      ${isActivated && 'bg-components-main-nav-nav-button-bg-active shadow-md font-semibold'}
    `}>
      <Link href={link}>
        <div
          onClick={() => setAppDetail()}
          className={classNames(`
            flex items-center h-7 px-2.5 cursor-pointer rounded-[10px]
            ${isActivated ? 'text-components-main-nav-nav-button-text-active' : 'text-components-main-nav-nav-button-text'}
          `)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className='mr-2'>
            {/* {
              (hovered && curNav)
                ? <ArrowNarrowLeft className='w-4 h-4' />
                : isActivated
                  ? activeIcon
                  : icon
            } */}
          </div>
          {text}
        </div>
      </Link>
      {
        showNav && isActivated && (
          <>
            <div className='font-light text-gray-300 '>/</div>
            <NavSelector
              navs={navs}
            />
          </>
        )
      }
    </div>
  )
}

export default Nav
