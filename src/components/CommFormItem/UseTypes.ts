import { Form, FormItemProps } from 'antd';

export type CommFormItemProps = {
    itemProps: FormItemProps; // antdのForm.Itemのprops型
    Comp: React.ElementType;   // 任意のReactコンポーネントを受け取る
    compProps?: Record<string, any>; // 任意のprops
    validations?: ValidationRule[];
    [key: string]: any;
};

export type ValidationRule = {
    vali: (value: any, valueObj: any) => boolean;
    msg: string;
};