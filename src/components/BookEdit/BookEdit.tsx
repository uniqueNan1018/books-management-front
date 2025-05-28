import React, { useState, useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { Button, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import { required, fewerOfCount, formItemsVali } from '../../utils/validation';
import CommFormItem from "../../components/CommFormItem";
import type { CommFormItemProps } from "../../components/CommFormItem/UseTypes";
import CategoryManage from "../CategoryManage";
import { useSelector, shallowEqual } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import axios from "axios";

interface BookInfo {
    title: string;
    category: number | undefined;
    summary: string,
    author: string | undefined;
    isbn: string | undefined;
    publisher: string | undefined;
    publishDate: moment.Moment | null;
    count: number | undefined;
    countOnBorrowed: number | undefined;
    location: number | undefined; // 同じ本は同じ場所に置く
    [key: string]: any;
}

type Option = {
    label: string | null,
    value: string | number | null,
};

type BookEditProps = {
    mode: 'edit' | 'create';
    id?: string;
    submit: {
        url: string;
        method: string;
    };
    callback?: () => void;
};

const BookEdit: React.FC<BookEditProps> = (props) => {
    const { mode } = props;
    const prevCategoryRef = useRef<number | undefined>(undefined);

    const [form] = Form.useForm();
    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
    const categoryList = useSelector((state: RootState) => state.category, shallowEqual);
    const [commFormItems, setCommFormItems] = useState<CommFormItemProps[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [bookInfo, setBookInfo] = useState<BookInfo>({
        title: "",
        category: undefined,
        summary: "",
        author: "",
        isbn: "",
        publisher: "",
        publishDate: null,
        count: undefined,
        countOnBorrowed: undefined,
        location: undefined,
    });

    useEffect(() => {
        console.log("categoryList", categoryList);

        const nextCategoryOptions = categoryList.map(item => ({
            label: item.categoryName,
            value: item.id,
        }));
        setCategoryOptions(nextCategoryOptions);
    }, [categoryList])

    useEffect(() => {
        form.setFieldsValue(bookInfo);
        setCommFormItems([{
            itemProps: {
                label: "書籍タイトル",
                name: "title",
                className: "f-item comm-form-item-container"
            },
            validations: [{
                vali: required,
                msg: "入力が必要です。",
            }],
            Comp: Input,
            compProps: {
                value: bookInfo.title,
                maxLength: 200,
                showCount: true,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    onItemChange("title", e.target.value);
                }
            },
        }, {
            itemProps: {
                label: "カテゴリ",
                name: "category",
                className: "category-item f-item"
            },
            validations: [{
                vali: required,
                msg: "入力が必要です。",
            }],
            Comp: Select,
            compProps: {
                value: bookInfo.category,
                options: categoryOptions,
                onChange: (value: number) => onItemChange("category", value),
            },
        }, {
            itemProps: {
                label: "サマリー",
                name: "summary",
                className: "f-item comm-form-item-container"
            },
            validations: [],
            Comp: Input.TextArea,
            compProps: {
                maxLength: 500,
                showCount: true,
                value: bookInfo.summary,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    onItemChange("summary", e.target.value);
                }
            },
        }, {
            itemProps: {
                label: "著者名",
                name: "author",
                className: "f-item comm-form-item-container"
            },
            validations: [],
            Comp: Input,
            compProps: {
                maxLength: 100,
                showCount: true,
                value: bookInfo.author,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    onItemChange("author", e.target.value);
                }
            },
        }, {
            itemProps: {
                label: "ISBNコード",
                name: "isbn",
                className: "f-item comm-form-item-container"
            },
            validations: [],
            Comp: Input,
            compProps: {
                maxLength: 20,
                showCount: true,
                value: bookInfo.isbn,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    onItemChange("isbn", e.target.value);
                }
            },
        }, {
            itemProps: {
                label: "出版社名",
                name: "publisher",
                className: "f-item comm-form-item-container"
            },
            validations: [],
            Comp: Input,
            compProps: {
                maxLength: 200,
                showCount: true,
                value: bookInfo.publisher,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    onItemChange("publisher", e.target.value);
                }
            },
        }, {
            itemProps: {
                label: "出版日付",
                name: "publishDate",
                className: "count-item f-item"
            },
            validations: [],
            Comp: DatePicker,
            compProps: {
                value: bookInfo.publishDate,
                onChange: (value: string) => {
                    onItemChange("publishDate", value);
                }
            },
        }, {
            itemProps: {
                label: "冊数",
                name: "count",
                className: "count-item"
            },
            validations: [{
                vali: required,
                msg: "入力が必要です。"
            }],
            Comp: InputNumber,
            compProps: {
                value: bookInfo.count,
                onChange: (value: number) => {
                    onItemChange("count", value);
                }
            },
        }, {
            itemProps: {
                label: "貸出中冊数",
                name: "countOnBorrowed",
                className: "count-item"
            },
            validations: [{
                vali: required,
                msg: "入力が必要です。"
            }, {
                vali: fewerOfCount,
                msg: "貸出中の冊数が、冊数を超えてはいけません。",
            }],
            Comp: InputNumber,
            compProps: {
                value: bookInfo.countOnBorrowed,
                onChange: (value: number) => {
                    onItemChange("countOnBorrowed", value);
                }
            },
        }]);
    }, [bookInfo, categoryOptions]);

    useEffect(() => {
        if (mode === "edit") {
            const url = `http://127.0.0.1:8080/logged/book/${props.id}`;
            axios({
                method: "GET",
                url,
                withCredentials: true,
            })
                .then((res) => {
                    const { code } = res.data;
                    if (code === 20041) {
                        const newBookInfo = { ...res.data.data };
                        prevCategoryRef.current = newBookInfo.category;
                        newBookInfo.publishDate = newBookInfo.publishDate ?
                            moment(newBookInfo.publishDate) : null;

                        setBookInfo(newBookInfo);
                    }
                })
        }
    }, []);

    const onItemChange = (key: string, value: string | number) => {
        setBookInfo(prevBookInfo => ({
            ...prevBookInfo,
            [key]: value,
        }));
    }

    const onSubmit = () => {
        const { valiRes, formItems } = formItemsVali(commFormItems, bookInfo);
        if (!valiRes) {
            setCommFormItems(formItems);
            return;
        }
        const { submit } = props;
        const data = { ...bookInfo };
        if (mode === "edit") {
            data.prevCategory = prevCategoryRef.current;
        }
        axios({
            ...submit,
            data,
            withCredentials: true
        })
            .then((res) => {
                const { code } = res.data;
                if (code === 20011 || code === 20031) {
                    const content = mode === "create" ?
                        "新規書籍を登録しました。" : "書籍を更新しました。";

                    messageApi
                        .open({
                            type: 'success',
                            content,
                            duration: 2, // 表示時間（秒）を明示
                        })
                        .then(() => {
                            props.callback?.();
                        });
                }
            });
    }

    return (
        <section className="comm-book-edit-container">
            <Form name="loginForm" form={form}>
                {
                    commFormItems.map((items, index) => (
                        <CommFormItem key={index} {...items} />
                    ))
                }
            </Form>
            <CategoryManage />
            <div className="submit-row">
                <Button type="primary" onClick={onSubmit}>
                    {mode === "create" ? "登録" : "確定"}
                </Button>
                <Button>リセット</Button>
            </div>
            {contextHolder}
        </section>
    )
}
export default BookEdit;