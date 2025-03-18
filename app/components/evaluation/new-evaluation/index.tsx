"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Radio, Upload, Select } from "antd";
import { UploadOutlined, InfoCircleFilled } from "@ant-design/icons";
import Toast from '@/app/components/base/toast'
import {
  addschemeCollections, updateSchemeCollections,
  fetchEvaluationObjectList
 } from '@/service/evaluation'
import EvaluationContext from '@/context/evaluation-context'
import { useContext } from 'use-context-selector'
import { EvaluationObjectItem } from '@/models/evaluation'
type NewEvaluationPrincipleModalProps = {
  setOpen?: () => void;
  open: boolean;
  target: any; // 这里之后需要改一下
  onCancel?: () => void;
};
const NewEvaluationPrincipleModal = ({
  open,
  setOpen,
  target,
  onCancel
}: NewEvaluationPrincipleModalProps) => {
  const { userInfo } = useContext(EvaluationContext)
  const [showSelect, setShowSelect] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([])
  const [evaluationObjectList, setEvaluationObjectList] = useState<EvaluationObjectItem[]>([])
  const NameByUrl = (url: string) => {
    if (!url) return '';
    // 处理路径分隔符，兼容反斜杠和正斜杠
    const normalizedUrl = url.replace(/\\/g, '/');
    // 获取最后一个斜杠后的内容
    const fileName = normalizedUrl.split('/').pop() || '';
    // 移除查询参数
    return fileName.split('?')[0];
  }
  useEffect(() => {
    if (open) {
      if (target?.evaluation_type == "规则评分") {
        setShowSelect(true)
      }
      if (target?.id) {
        if (target.path) {
          setFileList([{
            url: target.path,
            name: NameByUrl(target.path)
          }])
        }
        form?.setFieldsValue(target)
      }
    }
  }, [target, open]);
  const getEvaluationObjectList = async () => {
    const res = await fetchEvaluationObjectList()
    if(res.code === 200) {
      setEvaluationObjectList(res.data)
    }
  }
  useEffect(() => {
    getEvaluationObjectList()
  }, [])
  const formChange = (
    changedValues: Record<string, string>,
    allValues: any
  ) => {
    const key = Object.keys(changedValues)[0];
    const values = Object.values(changedValues)[0];
    if (key === "evaluation_type") {
      setShowSelect(values == "规则评分" ? true : false);
    }
  };
  const beforeUpload = (file: any) => {
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

    return false;
  };
  const opt = () => {
    if (!fileList.length) {
      Toast.notify({
        type: 'error',
        message: '请上传评测集文件'
      })
      return
    }
    form.validateFields().then(async (values) => {
      try {
        const formData = new FormData();
        // 将表单数据添加到 FormData
        Object.keys(values).forEach(key => {

          formData.append(key, values[key]);
        });
        // 将文件添加到 FormData
        fileList.forEach(file => {
          formData.append('file', file.originFileObj); // 这里的 'files[]' 是服务器接收文件时的字段名
        });
        formData.append('user_id', userInfo?.user_id || '')
        formData.append('user_name', userInfo?.user_name || '')
        formData.append('tenant_id', userInfo?.tenant_id || '')
        let res =null
        //@ts-ignore
        if (!target?.id) {
          //@ts-ignore
          res = await addschemeCollections(formData)
        } else { 
          res = await updateSchemeCollections({
            id: target.id,
            tenant_id: target.tenant_id,
            name: values.name,
            instructions: values.instructions,
            introduction: values.introduction,
          })
        }
        if (res?.code === 200) {
          Toast.notify({
            type: 'success',
            message: `${target?.id ? '更新' : '创建'}评测方案成功`
          });
          onCancel && onCancel();
        } else {
          throw new Error('请求失败');
        }
      } catch (error) {
        Toast.notify({
          type: 'error',
          message: `${target?.id ? '更新' : '创建'}评测方案失败`
        });
      }
    });
  }

  const uploadHandleChange = ({ fileList }: any) => {
    setFileList(fileList);
  }
  const closeModal = () => {
    onCancel && onCancel();
    setFileList([])
    form?.setFieldsValue({
      name: '',
      instructions: '',
      introduction: '',
      evaluation_type: '',
      evaluation_content: ''
    })
  };
  return (
    <Modal
      title={`${target?.id ? "编辑" : "新建"}评测方案`}
      width={640}
      onCancel={closeModal}
      footer={
        <>
          <Button type="primary" onClick={opt}>
            确认
          </Button>
          <Button
            onClick={closeModal}
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
        form={form}
        colon={false}

      >
        <Form.Item
          label="文件上传"
        >
          <Upload accept=".xls,.xlsx,.csv" beforeUpload={beforeUpload} onChange={uploadHandleChange} fileList={fileList} maxCount={1} disabled={target?.id}>
            {
              !target?.id && <>
                <Button icon={<UploadOutlined />} type="primary" shape="round" size="small">文件上传</Button>
                <>
                  <InfoCircleFilled className="text-sm text-[#FF9F69] ml-4 m-1" />
                  <span className="text-sm text-[#495464]">
                    支持上传excel或者csv格式文件，5M以内
                  </span>
                </>
              </>
            }
          </Upload>
        </Form.Item>
        <Form.Item label="评测集名称" name="name" rules={[{ required: true, message: '评测集名称为必填项' }]}   >
          <Input disabled={target?.id} />
        </Form.Item>
        <Form.Item label="适用说明" name="instructions" rules={[{ required: true, message: '适用说明为必填项' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="评测方式简介" name="introduction">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="评测方法" name="evaluation_type" rules={[{ required: true, message: '评测方法为必填项' }]}>
          <Radio.Group disabled={target?.id}>
            <Radio value="大模型评分"> 大模型评分 </Radio>
            <Radio value="规则评分"> 规则评分 </Radio>
            <Radio value="调用外部评分模型"> 调用外部评分模型 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label=" " name="evaluation_content" >
          {showSelect ? (
            <Select
              options={evaluationObjectList}
              fieldNames={{
                label: 'title',
              }}
              disabled={target?.id}
            />
          ) : (
            <Input.TextArea disabled={target?.id} />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewEvaluationPrincipleModal;
