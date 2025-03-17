/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-12 09:49:55
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-17 23:34:03
 * @FilePath: /yd-new/app/(commonLayout)/ability-explore/apps/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'
import React, { useEffect } from 'react'
import ExploreContext from '@/context/ability-explore-context'
// import ToolProviderList from '@/app/components/tools/provider-list'
import { useContext } from 'use-context-selector'
import OwnedList from '@/app/components/ability-explore/owned-list'
import DefaultToolsList from '@/app/components/ability-explore/default-tools-list'
import ThirdPartyToolsList from '@/app/components/ability-explore/third-party-tools-list'
import CustomToolsList from '@/app/components/ability-explore/custom-tools-list'
import RecommendedList from '@/app/components/ability-explore/recommended-list'
import TheThird from '@/app/components/ability-explore/the-third'
const Apps = () => {
    const { activeTabItem } = useContext(ExploreContext)
    return (
        <>
            <OwnedList className={(activeTabItem.key !== 'owned') ? 'hidden' : ''} />
            <ThirdPartyToolsList className={(activeTabItem.key !== 'thirdPartyTools') ? 'hidden' : ''} />
            <CustomToolsList className={(activeTabItem.key !== 'customTools') ? 'hidden' : ''} />
            <RecommendedList className={(activeTabItem.key !== 'recommended') ? 'hidden' : ''} />
            <DefaultToolsList className={(activeTabItem.key !== 'defaultTools') ? 'hidden' : ''} />
            <TheThird className={(activeTabItem.key !== 'thirdParty') ? 'hidden' : ''} />
        </>
    )
}

export default React.memo(Apps)