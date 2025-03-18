"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Radio, Upload, Select } from "antd";
import { UploadOutlined, InfoCircleFilled } from "@ant-design/icons";
import Toast from '@/app/components/base/toast'
import { getCollectionsSchemelist, addschemeCollections, getEvaluationObjectList } from '@/service/evaluation'
import { EvaluationRecord } from '@/models/evaluation'
type NewEvaluationPrincipleModalProps = {
    open: boolean;
    details: EvaluationRecord | undefined// 这里之后需要改一下
    onCancel?: () => void;
};
const NewReviewsModal = ({
    open,
    details,
    onCancel
}: NewEvaluationPrincipleModalProps) => {
    const [showSelect, setShowSelect] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([])
    const [objectList, setObjectList] = useState<string[]>([])
    const NameByUrl = (url: string) => {
        if (!url) return '';
        // 处理路径分隔符，兼容反斜杠和正斜杠
        const normalizedUrl = url.replace(/\\/g, '/');
        // 获取最后一个斜杠后的内容
        const fileName = normalizedUrl.split('/').pop() || '';
        // 移除查询参数
        return fileName.split('?')[0];
    }
    const getObjectList = async () => {
        const res = await getEvaluationObjectList()
        if (res.code === 200) {
            setObjectList(res.data)
        }
    }
    useEffect(() => {
        // getObjectList()
    }, [])
    useEffect(() => {
        if (details?.evaluation_type == "规则评分") {
            setShowSelect(true)
        }
        if (details?.id) {
            if (details.path) {
                setFileList([{
                    url: details.path,
                    name: NameByUrl(details.path)
                }])
            }
            form?.setFieldsValue(details)
        } else {
            setFileList([])
        }
    }, [open, details]);
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
                //@ts-ignore
                const res = await addschemeCollections(formData)

                if (res.code === 200) {
                    Toast.notify({
                        type: 'success',
                        message: `${details?.id ? '更新' : '创建'}评测方案成功`
                    });
                    onCancel && onCancel();
                } else {
                    throw new Error('请求失败');
                }
            } catch (error) {
                Toast.notify({
                    type: 'error',
                    message: `${details?.id ? '更新' : '创建'}评测方案失败`
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
        form.resetFields()
    };
    return (
        <Modal
            title={`${details?.id ? "编辑" : "新建"}评测方案`}
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
                <div className="my-2 flex items-center text-4">
                    <div className="w-[25px] h-[25px] bg-[#155EEF] rounded-full mr-2 text-white flex items-center justify-center">1</div>
                    <div className=" text-[#495464] font-bold">已选评测方案</div>
                </div>

                <Form.Item
                    label="评测集数据"
                >
                    <Upload accept=".xls,.xlsx,.csv" beforeUpload={beforeUpload} onChange={uploadHandleChange} fileList={fileList} maxCount={1} disabled>
                        {
                            !details?.id && <>
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
                    <Input disabled={true} />
                </Form.Item>
                <Form.Item label="评测方法" name="evaluation_type" rules={[{ required: true, message: '评测方法为必填项' }]}>
                    <Radio.Group disabled>
                        <Radio value="大模型评分"> 大模型评分 </Radio>
                        <Radio value="规则评分"> 规则评分 </Radio>
                        <Radio value="调用外部评分模型"> 调用外部评分模型 </Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label=" " name="evaluation_content" >
                    {showSelect ? (
                        <Select
                            options={[
                                { value: "1", label: "Jack" },
                                { value: "2", label: "Lucy" },
                                { value: "3", label: "Tom" },
                            ]}
                            disabled
                        />
                    ) : (
                        <Input.TextArea disabled />
                    )}
                </Form.Item>
                <div className="my-2 flex items-center text-4">
                    <div className="w-[25px] h-[25px] bg-[#155EEF] rounded-full mr-2 text-white flex items-center justify-center">2</div>
                    <div className=" text-[#495464] font-bold">选择评测对象</div>
                </div>
                <Form.Item label="评测对象" name="evaluation_content" rules={[{ required: true, message: '评测对象为必填项' }]}>
                    <Select
                        options={objectList.map(item => ({ value: item, label: item }))}
                    />
                </Form.Item>
                <Form.Item label="本次评测说明" name="evaluation_content" rules={[{ required: true, message: '本次评测说明为必填项' }]}>
                    <Input.TextArea placeholder="请输入评测次数，以及评测点或者原因，如“第2次评测，节点中新增意图识别，并引入本地知识库”" rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewReviewsModal;
