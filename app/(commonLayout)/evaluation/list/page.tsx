"use client";
import { useEffect, useMemo, useState } from "react";
import { RiAddLine, RiMoreFill } from "@remixicon/react";
import cn from "@/utils/classnames";
import type { EvaluationRecord } from "@/models/evaluation";
import Input from "@/app/components/base/input";
import s from "@/app/(commonLayout)/apps/style.module.css";
import { Button } from "antd";
import { QuestionCircleFilled, DashOutlined } from "@ant-design/icons";
import EvaluationPrincipleModal from "@/app/components/evaluation/evaluation-principle";
import NewEvaluationPrincipleModal from "@/app/components/evaluation/new-evaluation";
import CustomPopover from "@/app/components/base/popover";
import { useRouter } from "next/navigation";
import {
  getCollectionsSchemelist,
  deleteschemeCollections,
  downloadCollections,
} from "@/service/evaluation";
import Toast from "@/app/components/base/toast";
import EvaluationContext from "@/context/evaluation-context";
import { useContext } from "use-context-selector";
import dayjs from "dayjs";
export const sourceMap: { [key: number]: string } = {
  0: "本地上传",
  1: "平台预置",
};

const DefaultToolsList = () => {
  const { userInfo } = useContext(EvaluationContext);
  const [chooseTarget, setChooseTarget] = useState<
    EvaluationRecord | undefined
  >();
  const [allList, setAllList] = useState<EvaluationRecord[]>([]);
  const [keywords, setKeywords] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const router = useRouter();
  const handleKeywordsChange = (value: string) => {
    setKeywords(value);
  };
  const filterList = () => {
    return allList?.filter((collection) => {
      if (keywords) {
        return collection.name.toLowerCase().includes(keywords.toLowerCase());
      }
      return true;
    });
  };
  const Operations = (props: any) => {
    const { target } = props;
    const onMouseLeave = async () => {
      props.onClose?.();
    };

    const onClickDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const res = await deleteschemeCollections(target.id);
      if (res.code === 200) {
        Toast.notify({
          type: "success",
          message: "删除评测方案成功",
        });
        getDefaultToolsList();
      } else {
        Toast.notify({
          type: "error",
          message: res.message,
        });
      }
    };
    const downloadBlob = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      downloadCollections(target.id);
    };

    return (
      <div className="relative w-full" onMouseLeave={onMouseLeave}>
        {target.editStatus && (
          <button
            className={s.actionItem}
            onClick={(e) => {
              e.stopPropagation();
              setChooseTarget(target);
              setOpenNew(true);
            }}
          >
            <span className={cn(s.actionName, "text-[#667085]")}>编辑</span>
          </button>
        )}

        <button className={s.actionItem} onClick={downloadBlob}>
          <span className={cn(s.actionName, "text-[#667085]")}>下载</span>
        </button>
        {target.delStatus && (
          <div className={cn(s.actionItem, "group")} onClick={onClickDelete}>
            <span className={cn(s.actionName, "text-[#667085]")}>删除</span>
          </div>
        )}
      </div>
    );
  };

  const getDefaultToolsList = async () => {
    const res = await getCollectionsSchemelist(
      userInfo?.tenant_id || "",
      userInfo?.user_id || ""
    );
    if (res.code === 200) {
      setAllList(res.data.list || []);
    }
  };
  useEffect(() => {
    if (userInfo) {
      getDefaultToolsList();
    }
  }, [userInfo]);

  return (
    <div className="flex h-full relative  overflow-hidden bg-gray-100 shrink-0  grow">
      <div className="relative flex flex-col overflow-y-auto bg-gray-100 grow">
        <div
          className={cn(
            "sticky top-0 flex justify-between items-center pt-4 px-12  leading-[56px] bg-gray-100 z-20 flex-wrap gap-y-2 mb-4"
          )}
        >
          <div
            className={
              "mb-1 text-xl font-semibold items-center justify-between flex flex-1"
            }
          >
            <span className={s.textGradient}>评测方案管理</span>
            <div className="flex items-center gap-2">
              <Input
                showLeftIcon
                showClearIcon
                wrapperClassName="w-[200px]"
                value={keywords}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                onClear={() => handleKeywordsChange("")}
                placeholder="搜索评测方案"
              />
              <Button
                type="link"
                icon={<QuestionCircleFilled />}
                onClick={() => {
                  setOpen(true);
                }}
              >
                查看效果评测原理
              </Button>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "relative grid content-start grid-cols-1 gap-4 px-12 pt-2 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0"
          )}
        >
          <div
            className="flex flex-col col-span-1 bg-gray-200 border-[0.5px] border-black/5 rounded-xl min-h-[160px] transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-50 hover:shadow-lg"
            onClick={() => {
              setOpenNew(true);
            }}
            onMouseEnter={() => {
              setChooseTarget(undefined);
            }}
          >
            <div className="group grow rounded-t-xl hover:bg-white">
              <div className="shrink-0 flex items-center p-4 pb-3">
                <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-gray-100 rounded-lg group-hover:border-primary-100 group-hover:bg-primary-50">
                  <RiAddLine className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                </div>
                <div className="ml-3 text-sm font-semibold leading-5 text-gray-800 group-hover:text-primary-600">
                  新建评测方案
                </div>
              </div>
            </div>
          </div>
          {filterList().map((collection) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                router.push(`/evaluation/manage/${collection.id}`);
              }}
              onMouseEnter={() => {
                setChooseTarget(collection);
              }}
              onMouseLeave={() => {
                setChooseTarget(undefined);
              }}
              key={collection.id}
              className="relative h-[160px] group col-span-1 bg-components-card-bg border-[1px] border-solid border-components-card-border rounded-xl shadow-sm inline-flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg flex"
            >
              <div className="flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0">
                <div className="grow w-0 py-[1px]">
                  <div className="flex items-center text-sm leading-5 font-semibold text-text-secondary">
                    <div className='w-[40px] h-[40px] bg-[url("~@/app/components/evaluation/assets/card.png")] bg-cover bg-no-repeat bg-center my-4 mr-4'></div>
                    <div className="flex flex-col gap-1">
                      <div
                        className="font-bold text-[14px] text-[#1D2939]"
                        title={collection.name}
                      >
                        {collection.name}
                      </div>
                      <div className="flex items-center text-[#495464] text-[12px]  leading-[18px] text-text-tertiary font-medium">
                        发布于
                        {dayjs(collection.created_time).format("YYYY-MM-DD")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="title-wrapper h-[90px] px-[14px] text-xs leading-normal text-text-tertiary flex flex-col gap-1">
                <div className={cn("line-clamp-1")}>
                  来源：{sourceMap[collection.source as keyof typeof sourceMap]}
                </div>
                <div className={cn("line-clamp-1")}>
                  适用说明：{collection.instructions}
                </div>
              </div>
              <div
                className={cn(
                  " bottom-1 left-0 right-0 items-center shrink-0 pt-1 pl-[14px] pr-[6px] pb-[6px] h-[42px] flex justify-end"
                )}
              >
                <CustomPopover
                  htmlContent={<Operations target={collection} />}
                  position="br"
                  trigger="click"
                  btnElement={
                    <div className="flex items-center justify-center w-8 h-8 cursor-pointer rounded-md">
                      <RiMoreFill className="w-4 h-4 text-text-tertiary" />
                    </div>
                  }
                  btnClassName={(open) =>
                    cn(
                      open ? "!bg-black/5 !shadow-none" : "!bg-transparent",
                      "h-8 w-8 !p-2 rounded-md border-none hover:!bg-black/5"
                    )
                  }
                  className={"h-fit !z-20 "}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <EvaluationPrincipleModal
        open={open}
        setOpen={() => {
          setOpen(!open);
        }}
      />
      <NewEvaluationPrincipleModal
        open={openNew}
        setOpen={() => {
          setOpenNew(!openNew);
        }}
        target={chooseTarget}
        onCancel={() => {
          setChooseTarget(undefined);
          setOpenNew(false);
          getDefaultToolsList();
        }}
      />
    </div>
  );
};
DefaultToolsList.displayName = "List";
export default DefaultToolsList;
