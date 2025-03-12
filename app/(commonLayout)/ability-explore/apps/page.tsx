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
const Apps = () => {
    const { activeTabItem } = useContext(ExploreContext)
    return (
        <>
            <OwnedList className={(activeTabItem.key !== 'owned') ? 'hidden' : ''} />
            <ThirdPartyToolsList className={(activeTabItem.key !== 'thirdPartyTools') ? 'hidden' : ''} />
            <CustomToolsList className={(activeTabItem.key !== 'customTools') ? 'hidden' : ''} />
            <RecommendedList className={(activeTabItem.key !== 'recommended') ? 'hidden' : ''} />
        </>
    )
}

export default React.memo(Apps)