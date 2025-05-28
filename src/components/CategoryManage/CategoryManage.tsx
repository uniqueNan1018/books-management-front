import React, { useState, useEffect, use } from 'react';
import { Button, Table, Input, Modal, message } from 'antd';
import CommFormItem from "../../components/CommFormItem";
import { CategoryBase } from "./CategoryType";
import { update } from '../../stores/categorySlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import axios from 'axios';

const CategoryManage: React.FC = () => {
    interface Category extends CategoryBase {
        operate?: number | null;
        [key: string]: any;
    }
    type Valicate = {
        hasFeedback?: boolean;
        validateStatus?: "success" | "error";
        help?: string;
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [validate, setValidate] = useState<Valicate>({});
    const [newCategoryName, setNewCategoryName] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    const dispatch = useDispatch<AppDispatch>();

    const openModal = () => {
        getCategoryList();
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const getCategoryList = () => {
        axios({
            method: "GET",
            url: "http://127.0.0.1:8080/logged/category",
            withCredentials: true
        })
            .then((res) => {
                const { code } = res.data;
                if (code === 20041) {
                    const categoryList = [...res.data.data];
                    dispatch(update(categoryList));
                    const newCategoryList = [...categoryList];
                    newCategoryList.push({
                        id: "operate",
                        categoryName: null,
                        useCount: null,
                        operate: 1,
                    });
                    setCategoryList(newCategoryList);
                }
            });
    }

    useEffect(() => {
        getCategoryList();
    }, []);

    const newCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValidate({});
        setNewCategoryName(e.target.value);
    }

    const duplicateCheck = () => {
        if (newCategoryName == "") return false;
        const newCategory = encodeURIComponent(newCategoryName);
        const url = `http://127.0.0.1:8080/logged/category/cnt/${newCategory}`;
        axios.get(url)
            .then((res) => {
                const { data: resData } = res;
                const { data } = resData;
                const nextVali: Valicate = {};
                if (data === 0) {
                    nextVali.validateStatus = "success";
                    nextVali.hasFeedback = true;
                } else {
                    nextVali.validateStatus = "error";
                    nextVali.help = "同じカテゴリが既に存在します";
                }
                setValidate(nextVali);
            });
    }

    const createCategory = () => {

        if (newCategoryName == "") {
            setValidate({
                validateStatus: "error",
                help: "カテゴリ名を入力してください",
            });
            return;
        }
        const { validateStatus } = validate;
        if (validateStatus === "error") return;
        if (validateStatus === undefined) {
            const check = duplicateCheck();
            if (check === false) return;
        }
        axios({
            method: "POST",
            url: "http://127.0.0.1:8080/logged/category",
            data: { categoryName: newCategoryName },
            withCredentials: true
        })
            .then((res) => {
                const code = res.data.code;
                if (code === 20011) {
                    messageApi.open({
                        type: 'success',
                        content: 'カテゴリを追加しました',
                    });
                    reset();
                }
            })
    }

    const deleteCategory = (id: number) => {
        const url = `http://127.0.0.1:8080/logged/category/${id}`;
        axios({
            method: "DELETE",
            url,
            withCredentials: true
        })
            .then((res) => {
                const code = res.data.code;
                if (code === 20021) {
                    messageApi.open({
                        type: 'success',
                        content: 'カテゴリを削除しました',
                    });
                    reset();
                }
            })
    }

    const reset = () => {
        setValidate({});
        setNewCategoryName("");
        getCategoryList();
    }

    const columns = [{
        title: 'カテゴリ名',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: "50%",
        render: (value: string | null) => {
            console.log("validate", validate);

            return value !== null ? value : (
                <div>
                    <CommFormItem
                        itemProps={{
                            className: "category-edit",
                            ...validate
                        }}
                        Comp={Input}
                        compProps={{
                            showCount: true,
                            maxLength: 10,
                            value: newCategoryName,
                            onChange: newCategoryNameChange,
                            onBlur: duplicateCheck
                        }}
                    />
                </div>)
        }
    }, {
        title: '使用状態',
        dataIndex: 'useCount',
        key: 'useCount',
        render: (value: number | null) => {
            return value !== null && (
                value > 0 ? (<span>使用中</span>) : (<span>未使用</span>)
            )
        }
    }, {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (value: number | null | undefined, record: Category) => {
            const { useCount, id } = record;
            return typeof id === "number" && useCount === 0 ? (
                <span
                    className='opt' onClick={() => deleteCategory(id)}>
                    削除</span>
            ) : (value === 1 ? (
                <span className='opt' onClick={createCategory}>追加</span>
            ) : null)
        }
    }];

    return (
        <>
            <Button
                className="category-manage-btn"
                variant="solid"
                onClick={openModal}
                color="cyan">
                カテゴリ管理</Button>
            <Modal
                title="カテゴリ管理"
                open={modalOpen}
                footer={null}
                onCancel={closeModal}
            >
                <Table<Category>
                    rowKey={(recode) => recode.id}
                    className="category-manage-table"
                    columns={columns}
                    bordered
                    dataSource={categoryList}
                    size="small"
                    scroll={{ y: 300 }}
                    pagination={false}
                />
                {contextHolder}
            </Modal>
        </>
    )
}
export default React.memo(CategoryManage);