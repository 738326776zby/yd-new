"use client";
import React, { useState } from "react";
import { Button, Modal, Form, Input, Radio, Upload, Select } from "antd";
import { UploadOutlined, InfoCircleFilled } from "@ant-design/icons";
import Toast from '@/app/components/base/toast'
type NewEvaluationPrincipleModalProps = {
  setOpen: () => void;
  open: boolean;
  target: any; // 这里之后需要改一下
};
const NewEvaluationPrincipleModal = ({
  open,
  setOpen,
  target,
}: NewEvaluationPrincipleModalProps) => {
  const [showSelect, setShowSelect] = useState(false);
  console.log(target);
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  const formChange = (
    changedValues: Record<string, string>,
    allValues: any
  ) => {
    const key = Object.keys(changedValues)[0];
    const values = Object.values(changedValues)[0];
    if (key === "d") {
      setShowSelect(values == "two" ? true : false);
    }
  };
  const beforeUpload = (file:any) => {
    const isExcelOrCsv = file.type === 'application/vnd.ms-excel' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                         file.type === 'text/csv';

    if (!isExcelOrCsv) {
      Toast.notify({
        type: 'error',
        message: "您可以上传 Excel 或 CSV 文件!",
      })
      return 
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      Toast.notify({
        type: 'error',
        message: '文件大小必须小于 5MB!',
      })
    }

    return isExcelOrCsv && isLt5M;
  };
  return (
    <Modal
      title={`${target?.id ? "编辑" : "新建"}评测方案`}
      width={640}
      onCancel={() => {
        setOpen();
      }}
      footer={
        <>
          <Button type="primary" onClick={() => {}}>
            确认
          </Button>
          <Button
            onClick={() => {
              setOpen();
            }}
          >
            取消
          </Button>
        </>
      }
      open={open}
    >
      <Form
        labelCol={{ span: 4 }}
        variant={"filled"}
        layout="horizontal"
        className="mt-6"
        onValuesChange={formChange}
      >
        <Form.Item
          label="文件上传"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action="/upload.do" accept=".xls,.xlsx,.csv" beforeUpload={beforeUpload}>
            <Button icon={<UploadOutlined />} type="primary" shape="round" size="small">文件上传</Button>
            <>
              <InfoCircleFilled className="text-sm text-[#FF9F69] ml-4 m-1" />
              <span className="text-sm text-[#495464]">
                支持上传excel或者csv格式文件，5M以内
              </span>
            </>
          </Upload>
        </Form.Item>
        <Form.Item label="评测集名称" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="适用说明" name="b">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="评测方式简介" name="c">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="评测方法" name="d">
          <Radio.Group>
            <Radio value="one"> 大模型评分 </Radio>
            <Radio value="two"> 规则评分 </Radio>
            <Radio value="three"> 调用外部评分模型 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="评测方法" name="e">
          {showSelect ? (
            <Select
              options={[
                { value: "1", label: "Jack" },
                { value: "2", label: "Lucy" },
                { value: "3", label: "Tom" },
              ]}
            />
          ) : (
            <Input.TextArea />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewEvaluationPrincipleModal;
