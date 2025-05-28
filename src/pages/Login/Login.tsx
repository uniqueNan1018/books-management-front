import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Radio, message } from 'antd';
import CommFormItem from "../../components/CommFormItem";
import type { CommFormItemProps } from "../../components/CommFormItem/UseTypes";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { login } from '../../stores/userSlice';
import axios from 'axios';
import { required, formItemsVali } from '../../utils/validation';
const { Password } = Input;
const { Group: RadioGroup } = Radio;

const roleOptions = [{
    value: 1,
    label: "管理員"
}, {
    value: 2,
    label: "一般ユーザー"
}];

// userInfo の型を定義
interface UserInfo {
    username: string | undefined;
    password: string | undefined;
    role: number | undefined;
}

const Login: React.FC = () => {
    const [form] = Form.useForm();
    const [userInfo, setUserInfo] = useState<UserInfo>({
        username: undefined,
        password: undefined,
        role: undefined,
    });
    const [commFormItems, setCommFormItems] = useState<CommFormItemProps[]>([{
        itemProps: {
            label: "ユーザー名",
            name: "username",
        },
        validations: [{
            vali: required,
            msg: "ユーザー名を入力してください！",
        }],
        Comp: Input,
        compProps: {
            value: userInfo.username,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.value);
                
                onItemChange("username", e.target.value);
            }
        },
    }, {
        itemProps: {
            label: "パスワード",
            name: "password",
        },
        validations: [{
            vali: required,
            msg: "パスワードを入力してください！",
        }],
        Comp: Password,
        compProps: {
            value: userInfo.password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                onItemChange("password", e.target.value);
            }
        }
    }, {
        itemProps: {
            label: "ユーザー区分",
            name: "role",
        },
        validations: [{
            vali: required,
            msg: "ユーザー区分を選択してください！",
        }],
        Comp: RadioGroup,
        compProps: {
            options: roleOptions,
            value: userInfo.role,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                onItemChange("role", e.target.value);
            }
        }
    }]);
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate(); // useNavigateをコンポーネントのトップレベルで呼び出す

    const onItemChange = (key: string, value: string | number) => {
        setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            [key]: value,
        }));
    }

    useEffect(() => {
        console.log("userInfo updated:", userInfo);
    }, [userInfo]);

    const onReset = () => {
        setUserInfo({
            username: undefined,
            password: undefined,
            role: undefined,
        });
        form.resetFields();
    }

    const toBookList = () => {
        navigate("/booklist"); // ← これがReact Routerでの遷移
    }

    const onLogin = () => {
        const {valiRes, formItems} = formItemsVali(commFormItems, userInfo);
        if (!valiRes) {
            setCommFormItems(formItems);
            return;
        }
        axios({
            method: "POST",
            url: "http://127.0.0.1:8080/login",
            data: userInfo,
            withCredentials: true
        })
            .then((res) => {
                const { data: { code, data } } = res;
                if (code === 90040) {
                    messageApi.open({
                        type: 'error',
                        content: 'ログイン情報が間違いました。',
                    });
                    return;
                }
                if (code === 20041) {
                    messageApi.open({
                        type: 'success',
                        content: 'ログインしました。',
                    });
                    const userInfoStr = JSON.stringify(data);
                    sessionStorage.setItem("userinfos", userInfoStr);
                    dispatch(login({
                        name: data.username,
                        isManager: data.role === 1,
                    }));
                    toBookList();
                }
            })
    }


    return (
        <section className="login-container">
            <div className="login-container-immer">
                <Form
                    name="loginForm"
                    form={form}
                >
                    {
                        commFormItems.map((items, index) => (
                            <CommFormItem
                                key={index}
                                {...items}
                            />
                        ))
                    }
                    <div className="submit-row">
                        <Button type="primary" onClick={onLogin}>ログイン</Button>
                        <Button onClick={onReset}>リセット</Button>
                    </div>
                </Form>
                {contextHolder}
            </div>
        </section>
    )
}
export default Login;