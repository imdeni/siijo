import React from 'react';

const useForm = (initialValue: any) => {
    const [form, setForm] = React.useState(initialValue);

    const handleInputChange = (field: any, value: any) => {
        setForm((prevForm: any) => ({
            ...prevForm,
            [field]: value,
        }));
    };

    const setParams = (formType: any, formValue: any) => {
        if (formType === 'reset') {
            setForm(initialValue);
        } else {
            handleInputChange(formType, formValue);
        }
    };

    return [form, setParams];
};

export default useForm;