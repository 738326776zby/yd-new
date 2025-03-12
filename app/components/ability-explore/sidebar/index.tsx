'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import cn from '@/utils/classnames'
import { NavItem,NavSection } from '@/models/ability-explore'
import { useContext } from 'use-context-selector'
import ExploreContext from '@/context/ability-explore-context'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'

const SideBar: FC = () => {
  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: 'owned',
    searchParamName:'type'
  })
  const { setActiveTabItem } = useContext(ExploreContext)
  const [navList] = useState<NavSection[]>([
    {
      mainTitle: '数据与知识',
      desc: '基于元典自有的数据采集、治理、编辑、审核团队长期、持续的运营与维护，目前元典已积累形成了包括法律法规、公开裁判文书和权威案例、公开检察文书、企业工商信息、律师律所信息等在内近十类法律行业核心数据资产，可持续提供优质的数据更新、数据接口调用和专业数据产品服务，包括专项数据获取、以及各类数据关联获取等。',
      list: [
        {
          title: '元典自有',
          key: 'owned',
          icon: 'icon-home-smile-2-line',
        },
        {
          title: '第三方',
          key: 'thirdParty',
          icon: 'icon-bookmark-2-line',
        },
      ],
    },
    {
      mainTitle: '工具',
      desc: '工具是指基于平台规范默认内置，或者由用户自主配置和发布的各类专业数据、ai能力的接口或者组件服务，您可在工作流编排时直接调用，从而快速完成工作流的搭建和验证。',
      list: [
        {
          title: '元典工具',
          key: 'defaultTools',
          icon: 'icon-home-heart-line',
        },
        {
          title: '第三方工具',
          key: 'thirdPartyTools',
          icon: 'icon-bookmark-3-line',
          // category: 'builtin',
        },
        {
          title: '自定义工具',
          key: 'customTools',
          icon: 'icon-settings-3-line',
          // category: 'workflow',
        },
      ],
    },
    {
      mainTitle: '工作流应用',
      desc: '探索工作流应用：了解和使用基于工作流发布出的各类应用示例成果，相关应用示例的工作流，可在工作流编排模块下作为模板复用，以自定义您自己的工作流应用。',
      list: [
        {
          title: '元典推荐',
          key: 'recommended',
          icon: 'icon-chat-smile-2-line',
          // category: 'workflow',
        },
      ],
    },
  ])
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const getType = () => {
    const params = new URLSearchParams(searchParams)
    const type = params.get('type') || 'owned'
    setActiveTab(type)
    navList.forEach((navItem) => {
      navItem.list.forEach((item) => {
        if (item.key === type) {
          setActiveTabItem({
            ...item,
            ...navItem,
          })
        }
      })
    })
  }
  // 初始化获取参数
  useEffect(() => {
    getType()
  }, [])

  const sectionClick = (sectionItem: NavItem, section: NavSection) => {
    const key = sectionItem.key
    setActiveTab(key)
    setActiveTabItem({
      ...sectionItem,
      ...section,
    })
    if (!pathname.includes('ability-explore/apps')) { 
      let url = `/ability-explore/apps?type=${key}`
      router.push(url, { scroll: false })
    }
   
  }
  return (
    <div className="flex flex-col w-[160px] bg-white shadow-[0px_2px_4px_0px_rgba(217,219,232,0.51)] rounded-lg poverflow-y-auto mt-6 ml-10 py-4 h-max-content">
      {navList.map((section, index) => (
        <div key={index} className="mb-4">
          {/* 分组标题 */}
          <div
            className="px-4  text-sm font-medium text-gray-500"
            style={{
              height: '22px',
              fontFamily: 'PingFangSC, PingFang SC',
              fontWeight: 500,
              fontSize: '14px',
              color: '#1D2939',
              lineHeight: '22px',
              textAlign: 'justify',
              fontStyle: 'normal',
            }}
          >
            {section.mainTitle}
          </div>
          {/* 分组列表项 */}
          <div className="mt-3">
            {section.list.map((sectionItem) => (
              <div
                key={sectionItem.key}
                className={cn(
                  {
                    active: activeTab === sectionItem.key,
                  },
                  'flex items-center py-2 text-sm cursor-pointer hover:bg-[#EBF0FF] text-gray-700 px-4 [&.active]:bg-[#EBF0FF] [&.active]:text-[#155EEF] [&.active]:font-normal [&.active]:text-[14px]',
                )}
                onClick={() => {
                  sectionClick(sectionItem, section)
                }}
              >
                {/* 图标 */}
                <span className={`icon iconfont ${sectionItem.icon} mr-1`}></span>
                {/* 标题 */}
                <span>{sectionItem.title}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default React.memo(SideBar)