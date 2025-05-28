import React, { Children } from "react";
import { Form, FormItemProps } from 'antd';
import { CommFormItemProps } from "./UseTypes";

const CommFormItem: React.FC<CommFormItemProps> = (props) => {
    const { itemProps, Comp, compProps } = props;
    const { label, help: defaultHelp } = itemProps;
    const help = defaultHelp || `${label}は必須です！`;
    return (
        <Form.Item
            className="comm-form-item-container"
            help
            {...itemProps}
        >
            <Comp {...compProps} />
        </Form.Item>
    )
}
export default CommFormItem;

