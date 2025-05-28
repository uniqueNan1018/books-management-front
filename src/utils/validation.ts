import type { CommFormItemProps, ValidationRule } from "../components/CommFormItem/UseTypes";

export const required = (value: string | number | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    return true; 
};

export const fewerOfCount = (
    value: number,
    valueObj: {count: number, countOnBorrowed: number}
): boolean => {
    const { count } = valueObj;
    return count >= value;
}

export const formItemsVali = (
    formItems: CommFormItemProps[],
    valueObj: { [key: string]: any }
) => {
    let valiRes = true;
    const newFormItems = formItems.map((item) => {
        if (item.validations && item.validations.length > 0) {
            const { itemProps } = item;
            const value = valueObj[itemProps.name];
            for(const rule of item.validations) {
                const isValid = rule.vali(value, valueObj);
                if (!isValid) {
                    item.itemProps.validateStatus = "error";
                    item.itemProps.help = rule.msg;
                    valiRes = false;
                    break;
                }
            }
        }
        return item;
    });
    return {
        valiRes,
        formItems: newFormItems,
    }
}


