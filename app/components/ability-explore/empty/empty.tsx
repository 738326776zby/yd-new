/*
 * @Author: zhangboya3 zhangboya3@xiaomi.com
 * @Date: 2025-03-12 11:50:19
 * @LastEditors: zhangboya3 zhangboya3@xiaomi.com
 * @LastEditTime: 2025-03-19 22:40:17
 * @FilePath: /yd-new/app/components/ability-explore/empty/empty.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
"use client";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
const Empty = () => {

  return (
    <div className="flex flex-col items-center">
      <div className="shrink-0 w-[163px] h-[149px] bg-cover bg-no-repeat bg-[url('~@/app/components/ability-explore/empty/empty.png')]"></div>
      <div className="mb-1 text-[13px] font-medium text-gray-500 leading-[18px] mt-1">
        相关工具研发中，将陆续推出，敬请期待。
      </div>
    </div>
  );
};

export default Empty;
