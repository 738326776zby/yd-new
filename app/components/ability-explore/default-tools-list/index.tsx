'use client'
import React, { useEffect, useState } from 'react'
import { RiCloseLine } from '@remixicon/react'
import type {
  Collection,
  DefaultToolsListItem,
  DefaultToolsListResponse,
  FetchYdToolListReq
} from '@/models/ability-explore'
import cn from '@/utils/classnames'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import LabelFilter from '@/app/components/tools/labels/filter'
import Input from '@/app/components/base/input'
import ProviderCard from '@/app/components/tools/provider/card'
import ProviderDetail from '@/app/components/tools/provider/detail'

import s from '@/app/components/ability-explore/style.module.css'
import { useContext } from 'use-context-selector'
import ExploreContext from '@/context/ability-explore-context'
import Empty from './empty'
import { fetchYdToolList } from '@/service/ability-explore'

type ListProps = {
  className: string
}
const List = ({ className }: ListProps) => {
  const [activeTab, setActiveTab] = useState('all')
  const { activeTabItem } = useContext(ExploreContext)
  const options = [
    { value: 'all', text: '全部' },
    { value: 'information_search', text: '信息检索类' },
    { value: 'text_analyze', text: '文本解析类' },
    { value: 'document_process', text: '文档处理类' },
    { value: 'text_generation', text: '文本生成类' },
    { value: 'expert_rule', text: '专家规则类' },
    { value: 'multimodal', text: '多模态类' },
  ]
  const [tagFilterValue, setTagFilterValue] = useState<string[]>([])
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
    getDefaultToolsList({
      label: value
    })
  }
  const [keywords, setKeywords] = useState<string>('')
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    getDefaultToolsList({
      keyword: value
    })
  }

  const [collectionList, setCollectionList] = useState<Collection[]>([])
  const [xinxijiansuo, setXinxijiansuo] =
    useState<DefaultToolsListItem>(undefined)
  const [wenben, setWenben] = useState<DefaultToolsListItem>(undefined)
  const [wendangchuli, setWendangchuli] =
    useState<DefaultToolsListItem>(undefined)

  const getDefaultToolsList = async (params: FetchYdToolListReq) => {
    const list = await fetchYdToolList({
      label: tagFilterValue,
      keyword: keywords,
      scope: activeTab,
      ...params
    })
    console.log(list)
    // @ts-ignore
    // const { xinxijiansuo, wenben, wendangchuli } =
    //   test as DefaultToolsListResponse
    // setXinxijiansuo(xinxijiansuo)
    // setWenben(wendangchuli)
    // setWendangchuli(wendangchuli)
  }
  useEffect(() => {
    getDefaultToolsList({
      scope: 'all'
    })
  }, [])

  const [currentProvider, setCurrentProvider] = useState<
    Collection | undefined
  >()
  useEffect(() => {
    if (currentProvider && collectionList.length > 0) {
      const newCurrentProvider = collectionList.find(
        (collection) => collection.id === currentProvider.id,
      )
      setCurrentProvider(newCurrentProvider)
    }
  }, [collectionList, currentProvider])

  return (
    <div className={cn("flex h-full relative  overflow-hidden bg-gray-100 shrink-0  grow", className)}>
      <div className="relative flex flex-col overflow-y-auto bg-gray-100 grow">
        <div
          className={cn(
            'sticky top-0 flex justify-between items-center pt-4 px-12  leading-[56px] bg-gray-100 z-20 flex-wrap gap-y-2 mb-4',
            currentProvider && 'pr-6',
          )}
        >
          <div
            className={
              'mb-1 text-xl font-semibold items-center justify-between flex flex-1'
            }
          >
            <span className={s.textGradient}>
              {activeTabItem?.mainTitle}
            </span>
            <div className="flex items-center gap-2">
              <LabelFilter
                value={tagFilterValue}
                onChange={handleTagsChange}
              />
              <Input
                showLeftIcon
                showClearIcon
                wrapperClassName="w-[200px]"
                value={keywords}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                onClear={() => handleKeywordsChange('')}
              />
            </div>
          </div>
          <div className="text-gray-500 text-sm mb-2">
            {activeTabItem?.desc}
          </div>
          <TabSliderNew
            value={activeTab}
            onChange={(state) => {
              setActiveTab(state)
              getDefaultToolsList({
                scope: state
              })
              if (state !== activeTab) setCurrentProvider(undefined)
            }}
            options={options}
          />
        </div>
        {(activeTab === 'xinxijiansuo' || activeTab === '') &&
          xinxijiansuoList?.length > 0 && (
            <>
              <div className="flex  px-12 items-center">
                <span className="font-bold text-[14px] text-[#495464] mr-4">
                  信息检索类
                </span>
                <div>
                  <span className="icon iconfont icon-reserved-fill text-[#FF9F69] mr-1"></span>
                  <span className="text-[#495464] text-[14px]">
                    共<span className="text-[#155EEF] mx-1">XX</span>
                    个工具集，合计
                    <span className="text-[#155EEF] mx-1">XX</span>
                    个工具
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  'relative grid content-start grid-cols-1 gap-4 px-12 pt-2 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0',
                  currentProvider &&
                  'pr-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                )}
              >
                {xinxijiansuoList.map((collection) => (
                  <ProviderCard
                    active={currentProvider?.id === collection.id}
                    onSelect={() => setCurrentProvider(collection)}
                    key={collection.id}
                    collection={collection}
                  />
                ))}
              </div>
            </>
          )}
      </div>
    </div>
  )
}
export default React.memo(List)
