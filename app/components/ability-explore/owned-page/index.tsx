import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { fetcHhyydDataProvider } from "@/service/ability-explore";
import cn from "classnames";
import Introduce from "@/app/components/ability-explore/introduce";
import { HyydDataProviderReq } from "@/models/ability-explore";

export type PageProps = {
  id: string;
};

const Page: FC<PageProps> = ({ id }) => {
  const [introduce, setIntroduce] = useState<HyydDataProviderReq | null>(null);
  const [currentHtml, setCurrentHtml] = useState<string | null>(null);
  const getParams = async () => {
    const res = await fetcHhyydDataProvider(id);
    setIntroduce(res);
    Object.entries(res?.examples).map((item) => {
      setCurrentHtml(item[1]);
    });
  };
  useEffect(() => {
    getParams();
  }, [id]);
  return (
    <div
      className={cn(
        "flex h-full relative  overflow-hidden bg-gray-100 shrink-0  grow gap-4 mt-6 ml-4"
      )}
    >
      <div
        className="flex bg-white shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] flex-1 rounded-lg p-4 overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: currentHtml }}
      ></div>
      <div className="flex w-[408px] bg-white shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] rounded-lg gap-6 p-4 flex-col overflow-y-auto">
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
          <div className="text-[14px] text-[#495464]">
            {introduce?.full_description}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[14px] font-bold text-[#495464]">示例</div>
          <div className="flex gap-2 flex-col">
            {introduce &&
              Object.entries(introduce?.examples)?.map(([key, value]) => (
                <div
                  className="text-[14px] font-bold text-[#495464] bg-[#DEE9FF] rounded-[4px] py-1 px-4 cursor-pointer text-[#155EEF]"
                  onClick={() => {
                    setCurrentHtml(value);
                  }}
                >
                  {key}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Page);
