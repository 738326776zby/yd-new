"use client";
import React, { useEffect, useState } from "react";
import { RiCloseLine } from "@remixicon/react";
import type {
  Collection,
  FetchYdToolListReq,
  fetchYdToolListResItem,
  FetchYdToolListItemRes,
} from "@/models/ability-explore";
import cn from "@/utils/classnames";
import Detail from "@/app/components/ability-explore/provider/detail";
import TabSliderNew from "@/app/components/base/tab-slider-new";
import LabelFilter from "@/app/components/tools/labels/filter";
import Input from "@/app/components/base/input";
import ProviderCard from "@/app/components/tools/provider/card";
import s from "@/app/components/ability-explore/style.module.css";
import { useContext } from "use-context-selector";
import ExploreContext from "@/context/ability-explore-context";
import Empty from "./empty";
import { fetchYdToolList } from "@/service/ability-explore";

type ListProps = {
  className: string;
};
const List = ({ className }: ListProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const { activeTabItem } = useContext(ExploreContext);
  const [options, setOptions] = useState<{ value: string, text: string }[]>([{ value: "all", text: "全部" }])

  const [tagFilterValue, setTagFilterValue] = useState<string[]>([]);
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value);
    getDefaultToolsList({
      label: value,
    });
  };
  const [keywords, setKeywords] = useState<string>("");
  const [allData, setAllData] = useState<fetchYdToolListResItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const handleKeywordsChange = (value: string) => {
    setKeywords(value);
    getDefaultToolsList({
      keyword: value,
    });
  };

  const getDefaultToolsList = async (params: FetchYdToolListReq) => {
    setLoading(true);
    const data = await fetchYdToolList({
      label: tagFilterValue,
      keyword: keywords,
      scope: activeTab,
      ...params,
    });
    setLoading(false);
    setAllData(data);
    if (options.length === 1) {
      setOptions([...options, ...data.map((item) => ({ value: item.id, text: item.nameCN }))])
    }
  };
  useEffect(() => {
    getDefaultToolsList({
      scope: "all",
    });
  }, []);

  const [currentProvider, setCurrentProvider] = useState<
    Collection | undefined
  >();


  return (
    <div
      className={cn(
        "flex h-full relative  overflow-hidden bg-gray-100 shrink-0  grow",
        className
      )}
    >
      <div className="relative flex flex-col overflow-y-auto bg-gray-100 grow">
        <div
          className={cn(
            "sticky top-0 flex flex-col pt-4 px-12  leading-[56px] bg-gray-100 z-20 flex-wrap gap-y-2 mb-4",
            currentProvider && "pr-6"
          )}
        >
          <div
            className={
              "mb-1 text-xl font-semibold items-center justify-between flex flex-1"
            }
          >
            <span className={s.textGradient}>{activeTabItem?.mainTitle}</span>
            <div className="flex items-center gap-2">
              <LabelFilter value={tagFilterValue} onChange={handleTagsChange} />
              <Input
                showLeftIcon
                showClearIcon
                wrapperClassName="w-[200px]"
                value={keywords}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                onClear={() => handleKeywordsChange("")}
              />
            </div>
          </div>
          <div className="text-gray-500 text-sm mb-2">
            {activeTabItem?.desc}
          </div>
          <TabSliderNew
            value={activeTab}
            onChange={(state) => {
              setActiveTab(state);
              getDefaultToolsList({
                scope: state,
              });
              if (state !== activeTab) setCurrentProvider(undefined);
            }}
            options={options}
          />
        </div>
        {allData.map((optionItem, index) => {
          //@ts-ignore
          return (
            <div key={index}>
              {
                (activeTab === "all" || activeTab === optionItem.id) &&!loading&& <div className="flex  px-12 items-center my-1">
                  <span className="font-bold text-base text-[#495464] mr-4">
                    {optionItem?.nameCN}
                  </span>
                  { 
                    !optionItem?.items.length ?<div className="text-[#495464] text-[14px]">相关工具研发中，将陆续推出，敬请期待。</div>:  <div>
                    <span className="icon iconfont icon-reserved-fill text-[#FF9F69] mr-1"></span>
                    <span className="text-[#495464] text-[14px]">
                      共
                      <span className="text-[#155EEF] mx-1">
                        {optionItem?.provider_num}
                      </span>
                      个工具集，合计
                      <span className="text-[#155EEF] mx-1">
                        {optionItem?.tool_num}
                      </span>
                      个工具
                    </span>
                  </div>
                  }
                </div>
              }
              {
                !!optionItem?.items.length&&!loading&& <div
                  className={cn(
                    "relative grid content-start grid-cols-1 gap-4 px-12 pt-2 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0",
                    currentProvider &&
                    "pr-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  )}
                >
                  {optionItem?.items?.map((collection) => (
                    <ProviderCard
                      active={currentProvider?.id === collection.id}
                      onSelect={() => setCurrentProvider(collection)}
                      key={collection.id}
                      //@ts-ignore
                      collection={collection}
                      style={{
                        background: `linear-gradient( 180deg, ${optionItem.color} -1%, #FFFFFF 100%)`,
                        borderWidth:currentProvider?.id === collection.id?'2px':0
                      }}
                    />
                  ))}
                </div>
              }
            </div>
          );
        })}

      </div>
      <div
        className={cn(
          "shrink-0 w-0 border-l-[0.5px] border-black/8 overflow-y-auto transition-all duration-200 ease-in-out bg-white",
          currentProvider && "w-[420px]"
        )}
      >
        {currentProvider && (
          <Detail
            collection={currentProvider}
            onRefreshData={() => {
              getDefaultToolsList({})
            }}
            type="defaultTools"
          />
        )}
      </div>
      {currentProvider && (
        <div
          className="absolute top-5 right-5 p-1 cursor-pointer"
          onClick={() => setCurrentProvider(undefined)}
        >
          <RiCloseLine className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
export default React.memo(List);
