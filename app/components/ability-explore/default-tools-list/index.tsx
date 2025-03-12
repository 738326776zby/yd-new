'use client'
import React,{ useEffect, useState } from 'react'
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

import s from '@/app/components/tools/style.module.css'
import { useContext } from 'use-context-selector'
import ExploreContext from '@/context/explore-context'
import Empty from './empty'

const DefaultToolsList = () => {
  const { activeTabItem } = useContext(ExploreContext)
  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: '',
  })
  const options = [
    { value: '全部', text: '全部' },
    { value: '信息检索类', text: '信息检索类' },
    { value: '文本解析类', text: '文本解析类' },
    { value: '文档处理类', text: '文档处理类' },
    { value: '文本生成类', text: '文本生成类' },
    { value: '专家规则类', text: '专家规则类' },
    { value: '多模态类', text: '多模态类' },
  ]
  const [tagFilterValue, setTagFilterValue] = useState<string[]>([])
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
    getDefaultToolsList({
      label:value
    })
  }
  const [keywords, setKeywords] = useState<string>('')
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    getDefaultToolsList({
      keyword:value
    })
  }

  const [collectionList, setCollectionList] = useState<Collection[]>([])
  const [xinxijiansuo, setXinxijiansuo] =
    useState<DefaultToolsListItem>(undefined)
  const [wenben, setWenben] = useState<DefaultToolsListItem>(undefined)
  const [wendangchuli, setWendangchuli] =
    useState<DefaultToolsListItem>(undefined)
  const filterList = (list: Collection[], key: string) => {
    if (activeTab === key || activeTab === '') {
      return list?.filter((collection) => {
        if (
          tagFilterValue.length > 0 &&
          (!collection.labels ||
            collection.labels.every((label) => !tagFilterValue.includes(label)))
        )
          return false
        if (keywords) {
          return Object.values(collection.label).some((value) =>
            value.toLowerCase().includes(keywords.toLowerCase()),
          )
        }
        return true
      })
    } else {
      return []
    }
  }

  const getDefaultToolsList = async (params:FetchYdToolListReq ) => {
    console.log(111)
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
    getDefaultToolsList({})
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
  const wenbenList = filterList(wenben?.list, 'wenben')
  const xinxijiansuoList = filterList(xinxijiansuo?.list, 'xinxijiansuo')
  const wendangchuliList = filterList(wendangchuli?.list, 'wendangchuli')
  return (
    <>
      {activeTabItem.key === 'defaultTools' && (
        <div className="flex h-full relative flex overflow-hidden bg-gray-100 shrink-0 h-0 grow">
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
                        className={cn(
                          'relative overflow-hidden pb-2 group col-span-1 bg-white border-0 border-solid border-transparent rounded-lg shadow-sm flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg',
                          currentProvider?.id === collection.id &&
                          '!border-primary-400',
                          'bg-[linear-gradient(180deg,#EFF4FE_0%,#FFFFFF_100%)]',
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            {(activeTab === 'wenben' || activeTab === '') &&
              wenbenList?.length > 0 && (
                <>
                  <div className="flex  px-12 items-center">
                    <span className="font-bold text-[14px] text-[#495464] mr-4">
                      文本解析类
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
                    {wenbenList?.map((collection) => (
                      <ProviderCard
                        active={currentProvider?.id === collection.id}
                        onSelect={() => setCurrentProvider(collection)}
                        key={collection.id}
                        collection={collection}
                        className={cn(
                          'relative overflow-hidden pb-2 group col-span-1 bg-white border-0 border-solid border-transparent rounded-lg shadow-sm flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg',
                          currentProvider?.id === collection.id &&
                          '!border-primary-400',
                          'bg-[linear-gradient(180deg,#FFF5F0_0%,#FFFFFF_100%)] shadow-[0px_2px_4px_0px_rgba(217,219,232,0.51)]',
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            {(activeTab === 'wendangchuli' || activeTab === '') &&
              wendangchuliList?.length > 0 && (
                <>
                  <div className="flex px-12  items-center">
                    <span className="font-bold text-[14px] text-[#495464] mr-4">
                      文档处理类
                    </span>
                  <div>
                      <span className="icon iconfont  icon-information-fill text-[#FF9F69] mr-1"></span>
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
                    {wendangchuliList?.map((collection) => (
                      <ProviderCard
                        active={currentProvider?.id === collection.id}
                        onSelect={() => setCurrentProvider(collection)}
                        key={collection.id}
                        collection={collection}
                        className={cn(
                          'relative overflow-hidden pb-2 group col-span-1 bg-white  !border-0 border-transparent rounded-lg shadow-sm flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg',
                          currentProvider?.id === collection.id &&
                          '!border-primary-400',
                          'bg-[linear-gradient(180deg,#CFF1E6_0%,#FFFFFF_100%)] shadow-[0px_2px_4px_0px_rgba(217,219,232,0.51)]',
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            {
              !wendangchuliList?.length && !xinxijiansuoList?.length && !wenbenList?.length && <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'><Empty /></div>
            }
          </div>
          <div
            className={cn(
              'shrink-0 w-0 border-l-[0.5px] border-black/8 overflow-y-auto transition-all duration-200 ease-in-out bg-white',
              currentProvider && 'w-[420px]',
            )}
          >
            {currentProvider && (
              <ProviderDetail
                collection={currentProvider}
                onRefreshData={getDefaultToolsList}
              />
            )}
          </div>
          <div
            className="absolute top-5 right-5 p-1 cursor-pointer"
            onClick={() => setCurrentProvider(undefined)}
          >
            <RiCloseLine className="w-4 h-4" />
          </div>
        </div>
      )}
    </>
  )
}
DefaultToolsList.displayName = 'ToolDefaultToolsList'
export default React.memo(DefaultToolsList)
