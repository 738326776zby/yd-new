'use client'
import cn from "@/utils/classnames";
const isNew = ({ className }: { className: string }) => {
    return <div className={ cn('w-[40px] h-[20px] bg-[#FB6E6C] shadow-[0px_2px_4px_0px_rgba(251,110,108,0.14)] rounded-b-[6px] flex items-center justify-center text-white text-[12px]',className)}>New</div>
}
export default isNew