import cn from "@/utils/classnames";
import type { AppBasicInfo, InstalledApp } from "@/models/explore";
import AppIcon from "@/app/components/base/app-icon";
import { useTranslation } from "react-i18next";
import IsNew from "@/app/components/ability-explore/is-new";
import { AppTypeIcon } from '@/app/components/app/type-selector'
export type AppCardProps = {
  collection: AppBasicInfo;
  onSelect?: () => void;
  active?: boolean;
  data: InstalledApp;
};
const AppCard = ({ onSelect, collection, active, data }: AppCardProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "relative overflow-hidden pb-2 group col-span-1 bg-white border-2 border-solid border-transparent rounded-lg shadow-sm flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg",
        active && "!border-primary-400"
      )}
      onClick={onSelect}
    >
      {collection.is_new && <IsNew className="absolute top-[-2px] right-4" />}

      <div className="flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0">
        <div className='relative shrink-0'>
          <AppIcon
            size="large"
            iconType={collection.icon_type}
            icon={collection.icon}
            background={collection.icon_background}
            imageUrl={collection.icon_url}
          />
          <AppTypeIcon type={collection.mode} wrapperClassName='absolute -bottom-0.5 -right-0.5 w-4 h-4 shadow-sm' className='w-3 h-3' />
        </div>
        <div className="grow w-0 py-[1px]">
          <div className="flex items-center text-sm leading-5 font-semibold text-text-secondary">
            <div className="truncate" title={collection.name}>
              {collection.name}
            </div>
          </div>
          <div className="flex items-center text-[10px] leading-[18px] text-text-tertiary font-medium gap-2">
            {collection.mode === "advanced-chat" && (
              <div className="truncate">
                {t("app.types.advanced").toUpperCase()}
              </div>
            )}
            {collection.mode === "chat" && (
              <div className="truncate">
                {t("app.types.chatbot").toUpperCase()}
              </div>
            )}
            {collection.mode === "agent-chat" && (
              <div className="truncate">
                {t("app.types.agent").toUpperCase()}
              </div>
            )}
            {collection.mode === "workflow" && (
              <div className="truncate">
                {t("app.types.workflow").toUpperCase()}
              </div>
            )}
            {collection.mode === "completion" && (
              <div className="truncate">
                {t("app.types.completion").toUpperCase()}
              </div>
            )}
            <div className="truncate">更新于{data.publish_time}</div>
          </div>
        </div>
      </div>

      <div className="description-wrapper h-[90px] px-[14px] text-xs leading-normal text-text-tertiary ">
        <div className="line-clamp-4">{collection.description}</div>
      </div>
    </div>
  );
};

export default AppCard;
