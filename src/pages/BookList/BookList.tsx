import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, Form, AutoComplete, Switch, Table, Popconfirm, message } from 'antd';
import type { TableColumnsType } from 'antd';
import CommFormItem from "../../components/CommFormItem";
import { useSelector, shallowEqual } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import axios from "axios";
import { CategoryBase } from "../../components/CategoryManage/CategoryType";

interface Book {
    id: number;
    title: string;
    category: number;
    summary?: string;
    author?: string;
    isbn?: string;
    publisher?: string;
    publishDate?: string;
    count: number;
    countOnBorrowed: number;
    location?: number;
}

interface Search {
    title?: string;
    category?: number;
    count?: number;
    current?: number;
    pageSize: number;
    [key: string]: any;
};

interface SearchObj extends Search {
    current: undefined;
    fromNum: number;
}

type Option = { label: string  | null; value: string | number };

const BookList: React.FC = () => {
    const [categoryList, setCategoryList] = useState(useSelector((state: RootState) => state.category, shallowEqual));
    const [searchObj, setSearchObj] = useState<Search>({
        current: 1,
        pageSize: 10,
    });
    const navigate = useNavigate();
    const [bookList, setBookList] = useState<Book[]>([]);
    const [resCount, setResCount] = useState(0);
    const [titleOptions, setTitleOptions] = useState<Option[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (!categoryList.length) {
            getCategoryList();
        }
        if(!categoryOptions.length) {
            toCategoryOptions(categoryList);
        }
        getBooks();
    }, [searchObj]);

    const toCategoryOptions = (categoryList: CategoryBase[]) => {
        const nextCategoryOptions: Option[] = categoryList.map(item => ({
            label: item.categoryName,
            value: item.id,
        }));
        setCategoryOptions(nextCategoryOptions);
    }

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
                    setCategoryList(categoryList);
                    toCategoryOptions(categoryList);
                }
            });
    }

    const getBooks = () => {

        const data: SearchObj = {
            ...searchObj,
            fromNum: searchObj.current ? (searchObj.current - 1) * searchObj.pageSize : 0,
            current: undefined,
        };

        if (data.count === 0) {
            data.count = undefined;
        }

        axios({
            method: "POST",
            data: data,
            url: "http://127.0.0.1:8080/logged/book/search",
            withCredentials: true,
        })
            .then((res) => {
                const { code } = res.data;
                if (code === 20041) {
                    const { list, totalCount } = res.data.data;
                    setBookList([...list]);
                    setResCount(totalCount);
                }
            })
    }

    const onTitleSearch = (title: string) => {
        if (!!title.length) {
            const url = `http://127.0.0.1:8080/logged/book/titles/${title}`;
            axios({
                method: "GET",
                url,
                withCredentials: true,
            })
                .then((res) => {
                    const { code } = res.data;
                    if (code === 20041) {
                        const titles = [...res.data.data];
                        const nextTitleOptions = titles.map((t: string) => ({
                            label: t,
                            value: t,
                        }));
                        setTitleOptions(nextTitleOptions);
                    }
                })
        }

    }

    const onSearchChange = (key: string, value: any) => {
        const nextSearch = {
            ...searchObj,
            current: 1,
            [key]: value
        };
        setSearchObj(nextSearch);
    }

    const toEdit = (id: number) => {
        navigate(`/editbook/${id}`);
    }

    const renderSearch = () => {
        return (
            <Form
                name="book-search-Form"
                className="book-search-container"
            >
                <CommFormItem
                    itemProps={{
                        label: "書籍タイトル",
                        name: "title",
                    }}
                    Comp={AutoComplete}
                    compProps={{
                        onSearch: (title: string) => onTitleSearch(title),
                        options: titleOptions,
                        value: searchObj.title,
                        onChange: (value: string) => onSearchChange("title", value),
                    }}
                />
                <CommFormItem
                    itemProps={{
                        label: "書籍カテゴリ",
                        name: "category",
                    }}
                    Comp={Select}
                    compProps={{
                        allowClear: true,
                        options: categoryOptions,
                        value: searchObj.category,
                        onChange: (value: number) => onSearchChange("category", value),
                    }}
                />
                <CommFormItem
                    itemProps={{
                        label: "貸出可のみ",
                        name: "status",
                        className: "avai-item"
                    }}
                    Comp={Switch}
                    compProps={{
                        checked: searchObj.count === 1,
                        onChange: (value: boolean) => {
                            const val = value ? 1 : 0;
                            onSearchChange("count", val);
                        },
                    }}
                />
                <div>
                    <Button>リセット</Button>
                </div>
            </Form>
        )
    }

    const delBook = (book: Book) => {
        const { id, category } = book;
        axios({
            method: "DELETE",
            url: `http://127.0.0.1:8080/logged/book/bookId/${id}/cteId/${category}`,
            withCredentials: true
        })
            .then((res) => {
                const code = res.data.code;
                if(code === 20021) {
                    messageApi.open({
                        type: 'success',
                        content: '書籍を削除しました。',
                    })
                        .then(() => {
                            getBooks();
                        });
                }
            })
    }

    const columns: TableColumnsType<Book> = [{
        title: "書籍タイトル",
        dataIndex: "title",
        key: "title",
        width: 200,
        fixed: 'left',
    }, {
        title: "カテゴリ",
        dataIndex: "category",
        key: "category",
        render: (v: number) => categoryList.find(cte => cte.id === v)?.categoryName,
    }, {
        title: "サマリー",
        dataIndex: "summary",
        key: "summary",
        width: 300,
    }, {
        title: "著者名",
        dataIndex: "author",
        key: "author"
    }, {
        title: "ISBNコード",
        dataIndex: "isbn",
        key: "isbn"
    }, {
        title: "出版社名",
        dataIndex: "publisher",
        key: "publisher"
    }, {
        title: "出版日付",
        dataIndex: "publishDate",
        key: "publishDate"
    }, {
        title: "冊数",
        dataIndex: "count",
        key: "count"
    }, {
        title: "貸出中冊数",
        dataIndex: "countOnBorrowed",
        key: "countOnBorrowed"
    }, {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        fixed: 'right',
        width: 120,
        render: (v, record: Book) => {
            const { id } = record;
            return (
                <div>
                    <span
                        className="opt-item"
                        onClick={() => toEdit(id)}
                    >
                        編集
                    </span>
                    <Popconfirm
                        placement="topRight"
                        title="書籍削除"
                        description="この書籍を本当に削除してもよろしいですか？"
                        onConfirm={()=>delBook(record)}
                        okText="削除"
                        cancelText="キャンセル"
                    >
                        <span className="opt-item">削除</span>
                    </Popconfirm>

                </div>
            )
        }
    }];

    const onPageChange = (page: number) => {
        const newSearchObj = {...searchObj};
        newSearchObj.current = page;
        setSearchObj(newSearchObj);
    }

    const renderTable = () => {
        return (
            <section className="booklist-container">
                <div className="cnt-title-wrapper">
                    {`検索の結果、${resCount}件の書籍が見つかりました。`}
                </div>
                <Table<Book>
                    rowKey={(recode) => recode.id}
                    columns={columns}
                    dataSource={bookList}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        pageSize: searchObj.pageSize,
                        current: searchObj.current,
                        total: resCount,
                        onChange: onPageChange,
                    }}
                />
            </section>
        )
    }

    return (
        <article className="book-manager-list-container">
            {renderSearch()}
            {renderTable()}
            {contextHolder}
        </article>
    )
}

export default BookList;