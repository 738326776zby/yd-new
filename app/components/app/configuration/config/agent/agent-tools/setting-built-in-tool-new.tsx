"use client";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useContext } from "use-context-selector";
import cn from "@/utils/classnames";
import Drawer from "@/app/components/base/drawer-plus";
// import Input from '@/app/components/base/input'
import Form from "@/app/components/header/account-setting/model-provider-page/model-modal/Form";
import {
  addDefaultValue,
  toolParametersToFormSchemas,
} from "@/app/components/tools/utils/to-form-schema";
import { Input,Select } from 'antd'
// import TextArea from "@/app/components/base/TextArea";
import type { Collection, Tool } from "@/app/components/tools/types";
import { CollectionType } from "@/app/components/tools/types";
import {
  fetchCustomToolList,
  fetchModelToolList,
  fetchWorkflowToolList,
  fetchBuiltInToolList
} from "@/service/tools";
import {fetchTestTool,fetcHhyydToolsProviderList } from '@/service/ability-explore'
import I18n from "@/context/i18n";
import Button from "@/app/components/base/button";
import Loading from "@/app/components/base/loading";
import { DiagonalDividingLine } from "@/app/components/base/icons/src/public/common";
import { getLanguage } from "@/i18n/language";
import AppIcon from "@/app/components/base/app-icon";
// import Select from "@/app/components/base/select";
import {
  useSearchParams,
} from 'next/navigation'
import Toast from "@/app/components/base/toast";
type Props = {
  collection: Collection;
  isBuiltIn?: boolean;
  isModel?: boolean;
  toolName: string;
  setting?: Record<string, any>;
  readonly?: boolean;
  onHide: () => void;
  onSave?: (value: Record<string, any>) => void;
};
const { TextArea } = Input;
const SettingBuiltInTool: FC<Props> = ({
  collection,
  isBuiltIn = true,
  isModel = true,
  toolName,
  setting = {},
  readonly,
  onHide,
  onSave,
}) => {
  const { locale } = useContext(I18n);
  const language = getLanguage(locale);
  const { t } = useTranslation();
  const [output,setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const currTool = tools.find((tool) => tool.name === toolName);
  const formSchemas = currTool
    ? toolParametersToFormSchemas(currTool.parameters)
    : [];
  const infoSchemas = formSchemas.filter((item: any) => item.form === "llm");
  const settingSchemas = formSchemas.filter((item: any) => item.form !== "llm");
  const hasSetting = settingSchemas.length > 0;
  const [tempSetting, setTempSetting] = useState(setting);
  const [currType, setCurrType] = useState("info");
  const isInfoActive = currType === "info";
  const [paramsData, setParamsData] = useState<any>({});
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  useEffect(() => {
    if (!collection) return;

    (async () => {
      setIsLoading(true);
      try {
        const list = await new Promise<Tool[]>((resolve) => {
          (async function () {
            if (isModel) resolve(await fetchModelToolList(collection.name));
            else if (isBuiltIn)
              if (type === "defaultTools") {
                resolve(await fetcHhyydToolsProviderList(collection.name));
              } else if (type === 'owned') {
              } else { 
                resolve(await fetchBuiltInToolList(collection.name))
              }
             
            else if (collection.type === CollectionType.workflow)
              resolve(await fetchWorkflowToolList(collection.id));
            else resolve(await fetchCustomToolList(collection.name));
          })();
        });
        setTools(list);
        const currTool = list.find((tool) => tool.name === toolName);
        if (currTool) {
          const formSchemas = toolParametersToFormSchemas(currTool.parameters);
          setTempSetting(addDefaultValue(setting, formSchemas));

        }
      } catch (e) { }
      setIsLoading(false);
    })();
  }, [collection?.name, collection?.id, collection?.type]);

  useEffect(() => {
    setCurrType(!readonly && hasSetting ? "setting" : "info");
  }, [hasSetting]);

  const isValid = (() => {
    let valid = true;
    settingSchemas.forEach((item: any) => {
      if (item.required && !tempSetting[item.name]) valid = false;
    });
    return valid;
  })();

  const startTest = async () => {
    const errorList: string[] = []
    infoSchemas.forEach(infoItem => {
      if (infoItem.required && (paramsData[infoItem['name']] === '' || paramsData[infoItem['name']] === undefined)) {
        errorList.push(infoItem.label[language])
      }
    })
    if (errorList.length) {
      Toast.notify({
        type: 'error',
        message: `${errorList.join(";")} 字段为必填项`,
      })
      return
    }
    const res = await fetchTestTool({
      tool: currTool?.name || '',
      params: paramsData,
      collection: collection.name
    })
    Toast.notify({
      type: 'success',
      message: '验证已完成，请查看下方输出',
    })
    setOutput(JSON.stringify(res))
  };
  const getFormItem = (item: any) => {
    const { _type:type } = item
    if (type === "number") {
      return <Input
        className="resize-none mt-4"
        value={paramsData[item.name]}
        placeholder="请输入"
        variant="filled"
        type="number"
        onChange={(v) => {
          setParamsData({
            ...paramsData,
            [item.name]: v,
          });
        }}
      />
    } else if (type === 'boolean') {
      return <Select
        className="resize-none mt-4 w-full"
        value={paramsData[item.name]}
        options={[
          {
            //@ts-ignore
            value: true,
            label: "是",
          },
          {
            //@ts-ignore
            value: false,
            label: "否",
          },
        ]}
         variant="filled"
        onChange={(value) => {
          setParamsData({
            ...paramsData,
            [item.name]:value,
          });
        }}
      />
    } else if (type === 'select') {
      return <Select
        className="resize-none mt-4 w-full"
        variant="filled"
        value={paramsData[item.name]}
        onChange={(e) => {
          setParamsData({
            ...paramsData,
            [item.name]: e,
          });
        }}
        options={(item.options || []).map((i: any) => ({ label: i.value, value: i.value }))}
      />
    } else {
      //@ts-ignore
      return <TextArea
        className=" resize-none mt-4"
        autoSize
        variant="filled"
        value={paramsData[item.name]}
        onChange={(e) => {
          setParamsData({
            ...paramsData,
            [item.name]: e.target.value,
          });
        }}
        placeholder="请输入"
      />
    }
  }
  const infoUI = (
    <div className="pt-2">
      <div className="text-[14px]  text-[#495464] font-bold  mb-[7px]">

        {t("tools.setBuiltInTools.toolDescription")}
      </div>
      <div className="mt-1 leading-[18px] text-xs font-normal text-[#495464]">
        {currTool?.description[language]}
      </div>

      {infoSchemas.length > 0 && (
        <div className="mt-6">
          <div className="text-[14px]  text-[#495464]  mb-[7px] font-bold">
            {t("tools.setBuiltInTools.parameters")}
          </div>
          <div className="flex gap-4 mb-4">
            {/* @ts-ignored */}
            {currTool?.examples?.map((exampleItem, index) => {
              return (
                <div
                  className="w-[80px] h-[24px] bg-[#DEE9FF] rounded-[12px] flex items-center justify-center cursor-pointer text-[14px] text-[#155EEF]"
                  onClick={() => {
                    setParamsData(exampleItem);
                  }}
                >
                  示例{index + 1}
                </div>
              );
            })}
          </div>
          <div className="space-y-4 ">
            {infoSchemas.map((item: any, index) => (
              <div key={index}>
                <div className="flex items-center space-x-2 leading-[18px]">
                  <div className="text-[14px]  text-[#495464]">
                    {item.label[language]}
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {item.type === "number-input"
                      ? t("tools.setBuiltInTools.number")
                      : t("tools.setBuiltInTools.string")}
                  </div>
                  {item.required && (
                    <div className="text-xs font-medium text-[#EC4A0A]">
                      {t("tools.setBuiltInTools.required")}
                    </div>
                  )}
                </div>
                {item.human_description && (
                  <div className="mt-1 leading-[18px] text-xs font-normal text-gray-600">
                    {item.human_description?.[language]}
                  </div>
                )}
                {getFormItem(item)}

              </div>
            ))}
          </div>
          <div className="flex justify-center my-6">
            <Button
              className="w-[104px] h-[32px] rounded-[20px]"
              variant="primary"
              onClick={startTest}
            >
              开始验证
            </Button>
          </div>
          <div className="text-[14px]  text-[#495464]   font-bold">输出</div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-600 font-mono">
              {output ? JSON.stringify(JSON.parse(output), null, 2) : "暂无输出"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  const settingUI = (
    <Form
      value={tempSetting}
      onChange={setTempSetting}
      formSchemas={settingSchemas as any}
      isEditMode={false}
      showOnVariableMap={{}}
      validating={false}
      inputClassName="!bg-gray-50"
      readonly={readonly}
    />
  );

  return (
    <Drawer
      isShow
      onHide={onHide}
      title={
        <div className="flex items-center">
          {typeof collection.icon === "string" ? (
            <div
              className="w-6 h-6 bg-cover bg-center rounded-md flex-shrink-0"
              style={{
                backgroundImage: `url(${collection.icon})`,
              }}
            ></div>
          ) : (
            <AppIcon
              className="rounded-md"
              size="tiny"
              icon={(collection.icon as any)?.content}
              background={(collection.icon as any)?.background}
            />
          )}

          <div className="ml-2 leading-6 text-base font-semibold text-gray-900">
            {currTool?.label[language]}
          </div>
          {hasSetting && !readonly && (
            <>
              <DiagonalDividingLine className="mx-4" />
              <div className="flex space-x-6">
                <div
                  className={cn(
                    isInfoActive
                      ? "text-gray-900 font-semibold"
                      : "font-normal text-gray-600 cursor-pointer",
                    "relative text-base"
                  )}
                  onClick={() => setCurrType("info")}
                >
                  {t("tools.setBuiltInTools.info")}
                  {isInfoActive && (
                    <div className="absolute left-0 bottom-[-16px] w-full h-0.5 bg-primary-600"></div>
                  )}
                </div>
                <div
                  className={cn(
                    !isInfoActive
                      ? "text-gray-900 font-semibold"
                      : "font-normal text-gray-600 cursor-pointer",
                    "relative text-base "
                  )}
                  onClick={() => setCurrType("setting")}
                >
                  {t("tools.setBuiltInTools.setting")}
                  {!isInfoActive && (
                    <div className="absolute left-0 bottom-[-16px] w-full h-0.5 bg-primary-600"></div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      }
      panelClassName="mt-[65px] !w-[405px]"
      maxWidthClassName="!max-w-[405px]"
      height="calc(100vh - 65px)"
      // headerClassName='!border-b-black/5'
      body={
        <div className="h-full pt-3">
          {isLoading ? (
            <div className="flex h-full items-center">
              <Loading type="app" />
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="grow h-0 overflow-y-auto  px-6">
                {isInfoActive ? infoUI : settingUI}
              </div>
              {!readonly && !isInfoActive && (
                <div className="mt-2 shrink-0 flex justify-end py-4 px-6  space-x-2 rounded-b-[10px] bg-gray-50 border-t border-black/5">
                  <Button
                    className="flex items-center h-8 !px-3 !text-[13px] font-medium !text-gray-700"
                    onClick={onHide}
                  >
                    {t("common.operation.cancel")}
                  </Button>
                  <Button
                    className="flex items-center h-8 !px-3 !text-[13px] font-medium"
                    variant="primary"
                    disabled={!isValid}
                    onClick={() =>
                      onSave?.(addDefaultValue(tempSetting, formSchemas))
                    }
                  >
                    {t("common.operation.save")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      }
      isShowMask={false}
      clickOutsideNotOpen={false}
    />
  );
};
export default React.memo(SettingBuiltInTool);
