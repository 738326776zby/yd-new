"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { Checkbox, Table } from "antd";
import Input from "@/app/components/base/input";
import { EvaluationRecord, GetRecordlistReq } from "@/models/evaluation";
import {
  getRecordlist,
  downloadReviews,
  downloadCollections,
  getCollectionsSchemelist,
  getEvaluationObjectList,
  fetchRestartStart,
} from "@/service/evaluation";
import NewReviewsModal from "@/app/components/evaluation/new-reviews-modal";
import { sourceMap } from "../../list/page";
import dayjs from "dayjs";
import { useAppContext } from "@/context/app-context";
import {
  DownloadOutlined,
  CheckCircleFilled,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import cn from "classnames";
import "./index.css";
import Toast from "@/app/components/base/toast";
export type AppListProps = {
  params: {
    id: string;
  };
};
let timer = null;
const statusMap = {
  0: "进行中",
  1: "完成",
  2: "可以重试",
  3: "错误",
};
const AppList = ({ params: { id: collections_id } }: AppListProps) => {
  const {
    userInfo: { tenant_id, user_id },
  } = useAppContext();
  const restart = async (id: string) => {
    const res = await fetchRestartStart(id);
    if (res.code === 200) {
      Toast.notify({
        type: "success",
        message: "重新评测成功",
      });
      getTableList({});
    } else {
      Toast.notify({
        type: "error",
        message: "重新评测失败",
      });
    }
  };
  const [tableParams, setTableParams] = useState<GetRecordlistReq>({
    tenant_id,
    collections_id,
    user_id: user_id || "",
    pageNum: 1,
    pageSize: 10,
    evaluation_object: "",
    filter_curr_user: false,
    evaluation_time_order: "DESC",
    results_order: "DESC",
  });
  const columns = [
    {
      title: "序号",
      dataIndex: "name",
      key: "name",
      //@ts-ignore
      render: (a, b, i) => {
        return i + 1;
      },
    },
    {
      title: "评测对象",
      dataIndex: "evaluation_object",
      key: "evaluation_object",
      render: (text: string) => {
        return objectList.find((item) => item.value === text)?.label;
      },
    },
    {
      title: "本次评测说明",
      dataIndex: "task_description",
      key: "task_description",
    },
    {
      title: "评测人",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: (
        <span className="flex items-center flex justify-between cursor-pointer">
          <span>评测时间</span>
          <span
            className="flex items-center flex-col"
            onClick={() => {
              getTableList({
                evaluation_time_order:
                  tableParams?.evaluation_time_order === "ASC" ? "DESC" : "ASC",
              });
            }}
          >
            <CaretUpOutlined
              className={cn(
                "text-[10px]",
                tableParams?.evaluation_time_order === "ASC"
                  ? "text-[#155EEF]"
                  : "text-[#667085]"
              )}
            />
            <CaretDownOutlined
              className={cn(
                "text-[10px]",
                tableParams?.evaluation_time_order === "DESC"
                  ? "text-[#155EEF]"
                  : "text-[#667085]"
              )}
            />
          </span>
        </span>
      ),
      dataIndex: "evaluation_time",
      key: "evaluation_time",
      render: (text: string) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: (
        <span className="flex items-center flex justify-between cursor-pointer">
          <span>评测结果</span>
          <span
            className="flex items-center flex-col"
            onClick={() => {
              getTableList({
                results_order:
                  tableParams?.results_order === "ASC" ? "DESC" : "ASC",
              });
            }}
          >
            <CaretUpOutlined
              className={cn(
                "text-[10px]",
                tableParams?.results_order === "ASC"
                  ? "text-[#155EEF]"
                  : "text-[#667085]"
              )}
            />
            <CaretDownOutlined
              className={cn(
                "text-[10px]",
                tableParams?.results_order === "DESC"
                  ? "text-[#155EEF]"
                  : "text-[#667085]"
              )}
            />
          </span>
        </span>
      ),
      dataIndex: "results",
      key: "results",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text: number) => {
        if (text == 0) {
          return (
            <span className="text-[#389BFF]">
              {" "}
              <span className={`icon iconfont icon-jiazai mr-2`}></span>评测中
            </span>
          );
        } else if (text === 1) {
          return (
            <span className="text-[#50B593]">
              <CheckCircleFilled className="mr-2" />
              评测成功
            </span>
          );
        } else if (text === 2 || text === 3) {
          return (
            <span className="text-[#FB6E6C]">
              <CheckCircleFilled className="mr-2" />
              评测失败
            </span>
          );
        }
        return "";
      },
    },
    {
      title: "操作",
      dataIndex: "opt",
      key: "opt",
      //@ts-ignore
      render: (text, row) => {
        return (
          <>
            {row.status === 1 && (
              <Button
                type="link"
                onClick={() => {
                  downloadReviews(row.id, row.collections_id);
                }}
                icon={
                  <span className={`icon iconfont icon-download-2-line`}></span>
                }
              >
                查看评测报告
              </Button>
            )}
            {row.status === 2 && (
              <Button
                onClick={() => {
                  restart(row.id);
                }}
                type="link"
                icon={<span className={`icon iconfont icon-shuaxin`}></span>}
              >
                重新评测
              </Button>
            )}
          </>
        );
      },
    },
  ];
  const [details, setDetaills] = useState<EvaluationRecord | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState<EvaluationRecord[]>([]);

  const [objectList, setObjectList] = useState<
    { value: string; label: string }[]
  >([]);
  const getObjectList = async () => {
    const res = await getEvaluationObjectList();
    if (res.code === 200) {
      const list = Object.entries(res.data).map((item) => {
        return {
          value: item[0],
          label: item[1],
        };
      });
      setObjectList(list);
    }
  };
  const getDetailsList = async () => {
    const res = await getCollectionsSchemelist(tenant_id || "", user_id || "");
    if (res.code === 200) {
      const _detail = res.data?.list.filter(
        (item) => item.id === collections_id
      );
      setDetaills(_detail?.[0] || undefined);
    }
  };
  const getTableList = async (params: GetRecordlistReq) => {
    const res = await getRecordlist({
      ...tableParams,
      user_id: user_id || "",
      ...params,
    });
    // @ts-ignore
    if (res.code === 200) {
      //@ts-ignore
      setTableData(res.data.list);
      const { pages } = res.data;
      setTableParams({
        ...tableParams,
        pages,
        ...params,
      });
    }
  };
  useEffect(() => {
    if (user_id) {
      getDetailsList();
      getTableList({});
    }
    getObjectList();
  }, [user_id]);
  useEffect(() => {
    clearInterval(timer);
    timer = null;
    timer = setInterval(() => {
      getTableList({});
    }, 1000 * 5);
    return () => {
      clearInterval(timer);
      timer = null;
    };
  }, [tableParams]);
  const downloadCollection = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (details) {
      downloadCollections(details?.id);
    }
  };
  return (
    <div className="relative flex justify-center overflow-y-auto bg-background-body shrink-0  grow  gap-4 p-6">
      <div className="w-[336px] bg-white flex flex-col shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] rounded-lg border border-[#E1E3E7]">
        <div className="flex  pt-[14px] px-[14px] pb-4 border-b border-dashed border-[#E1E3E7] ">
          <div className="grow  py-[1px] flex-1">
            <div className="flex items-center text-sm leading-5 font-semibold text-gray-800 justify-between">
              <div
                className="truncate text-[#1D2939] text-[14px]"
                title={details?.name}
              >
                {details?.name}
              </div>
              <Button
                type="link"
                icon={<DownloadOutlined />}
                className="text-[14px]"
                onClick={downloadCollection}
              >
                下载
              </Button>
            </div>
            <div className="flex items-center text-[10px] leading-[18px] text-gray-500 font-medium">
              <div className="truncate text-[12px]">
                发布于&nbsp;{dayjs(details?.created_time).format("YYYY-MM-DD")}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-4 gap-4">
          <div className="flex flex-col flex-1 gap-1 text-[#667085] text-[14px]">
            <div className="flex gap-1 items-center text-[#495464]">
              <span className="inline-block w-[6px] h-[6px]  bg-[#155EEF] rounded-full"></span>
              来源
            </div>
            <div>{sourceMap[details?.source || 0]}</div>
          </div>
          <div className="flex flex-col flex-1 gap-1 text-[#667085] text-[14px]">
            <div className="flex gap-1 items-center text-[#495464]">
              <span className="inline-block w-[6px] h-[6px]  bg-[#155EEF] rounded-full"></span>
              适用说明
            </div>
            <div>{details?.instructions}</div>
          </div>
          <div className="flex flex-col flex-1 gap-1 text-[#667085] text-[14px]">
            <div className="flex gap-1 items-center text-[#495464]">
              <span className="inline-block w-[6px] h-[6px]  bg-[#155EEF] rounded-full"></span>
              评测方式简介
            </div>
            <div>{details?.introduction}</div>
          </div>
          <div className="flex flex-col flex-1 gap-1 text-[#667085] text-[14px]">
            <div className="flex gap-1 items-center text-[#495464]">
              <span className="inline-block w-[6px] h-[6px] bg-[#155EEF] rounded-full"></span>
              评测方法
            </div>
            <div>{details?.evaluation_type}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white flex flex-col border-r-3  shadow-[0px_8px_16px_0px_rgba(217,219,232,0.51)] rounded-lg border border-[#E1E3E7]">
        <div className="flex items-center justify-between p-4">
          <div>
            <Checkbox
              value={!!tableParams.filter_curr_user}
              onChange={(e) => {
                getTableList({
                  filter_curr_user: e.target.checked,
                });
              }}
            >
              只看我的评测记录
            </Checkbox>
          </div>
          <div className="flex gap-4">
            <Input
              showLeftIcon
              showClearIcon
              wrapperClassName="w-[200px]"
              value={tableParams.evaluation_object}
              placeholder="请输入关键字按回车键查询"
              onChange={(e) => {
                setTableParams({
                  ...tableParams,
                  evaluation_object: e.target.value,
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getTableList({
                    evaluation_object: e.target.value,
                  });
                }
              }}
              onClear={() => {
                getTableList({
                  evaluation_object: "",
                });
              }}
            />
            <Button
              shape="round"
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              新建评测
            </Button>
          </div>
        </div>
        <Table
          dataSource={tableData}
          columns={columns}
          size="small"
          bordered
          className="evaluation-table"
          rowKey={(record) => record.id}
          pagination={{
            position: ["bottomCenter"],
            pageSize: tableParams.pageSize,
            total: tableParams.pages,
            showQuickJumper: true,
            showTotal: (total, range) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              getTableList({
                pageNum: page,
                pageSize: pageSize,
              });
            },
          }}
        />
        <NewReviewsModal
          details={details}
          onCancel={() => {
            setOpen(false);
            getTableList({});
          }}
          open={open}
          objectList={objectList}
        />
      </div>
    </div>
  );
};

export default AppList;
