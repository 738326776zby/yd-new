/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-12 09:36:14
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-19 12:08:18
 * @FilePath: /yd-new/app/components/header/evaluation-nav/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect} from 'react'
import { useSelectedLayoutSegment } from 'next/navigation'
import Nav from '../nav-new'
import { type NavItem } from '../nav/nav-selector'
import classNames from '@/utils/classnames'
import { userInfo } from 'os'
import { getCollectionsSchemelist } from '@/service/evaluation'
import { useSearchParams } from 'next/navigation'
import { EvaluationRecord } from '@/models/evaluation'
type EvaluationsNavProps = {
  className?: string
}

const EvaluationsNav = ({
  className,
}: EvaluationsNavProps) => {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment?.includes('evaluation')
  const [navItems, setNavItems] = useState<EvaluationRecord[]>([])
  const tenant_id = searchParams.get('tenant_id')
  const user_id = searchParams.get('user_id')
  const collections_id = searchParams.get('collections_id')

  const getDefaultToolsList = async () => {
    const res = await getCollectionsSchemelist(tenant_id||'',user_id||''  )
    if (res.code === 200) {
      const list = res.data.list || []
      setNavItems(list)
    }
  }
  useEffect(() => {
    getDefaultToolsList()
  }, [])
  return (
    <Nav
      icon={<span className='icon iconfont icon-character-recognition-line'></span>}
      activeIcon={<span className='icon iconfont icon-character-recognition-fill'></span>}
      text={"效果评测"}
      activeSegment={['evaluation']}
      link='/evaluation/apps'
      navs={navItems}
      />
  )
}

export default EvaluationsNav