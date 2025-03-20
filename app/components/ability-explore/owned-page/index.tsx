/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-17 22:40:18
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-18 13:50:17
 * @FilePath: /yd-new/app/components/ability-explore/owned-page/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { fetcHhyydDataProvider } from "@/service/ability-explore";
import cn from "classnames";
import Introduce from "@/app/components/ability-explore/introduce";
import { HyydDataProviderReq } from "@/models/ability-explore";
import { Skeleton } from "antd";

export type PageProps = {
  id: string;
};

const Page: FC<PageProps> = ({ id }) => {
  const [introduce, setIntroduce] = useState<HyydDataProviderReq | null>(null);
  const [currentHtml, setCurrentHtml] = useState<string | null>(null);
  const getParams = async () => {
    const res = await fetcHhyydDataProvider(id);
    setIntroduce(res);
    setCurrentHtml(res?.examples[0]?.content)
  };
  useEffect(() => {
    getParams();
  }, [id]);
  return (
    <div
      className={cn(
        "flex h-full relative  overflow-hidden bg-gray-100 shrink-0  grow gap-4 pt-6 ml-4"
      )}
    >
      <div
        className="flex bg-white shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] flex-1 rounded-lg p-4 overflow-y-auto"
      >
        { 
          currentHtml ? <div dangerouslySetInnerHTML={{ __html: currentHtml }}></div> : <Skeleton active paragraph={{rows:10}} />
        }
      </div>
      <div className="flex w-[408px] bg-white shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] rounded-lg gap-6 p-4 flex-col overflow-y-auto">
        { 
          introduce ? <>
           <div className="flex  gap-6 items-center">
          {typeof introduce?.icon === "string" && (
            <div
              className="w-14 h-14 bg-center bg-cover bg-no-repeat rounded-md"
              style={{ backgroundImage: `url(${introduce.icon})` }}
            />
          )}
          <div className="text-[16px] text-[#495464] font-bold ">
            {introduce?.name}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[14px] font-bold text-[#495464]">介绍</div>
          <div className="text-[14px] text-[#495464]" dangerouslySetInnerHTML={{ __html: introduce?.full_description }}>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[14px] font-bold text-[#495464]">示例</div>
          <div className="flex gap-2 flex-col">
            {introduce &&
             introduce?.examples?.map((item) => (
                <div
                  className="text-[14px] font-bold text-[#495464] bg-[#DEE9FF] rounded-[4px] py-1 px-4 cursor-pointer text-[#155EEF]"
                  onClick={() => {
                    setCurrentHtml(item.content);
                  }}
                 key={item.name}
                >
                  {item.name}
                </div>
              ))}
          </div>
        </div></>:<Skeleton active paragraph={{rows:10}} avatar/>
        }
       
      </div>
    </div>
  );
};
export default React.memo(Page);
