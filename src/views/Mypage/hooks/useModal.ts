import { useState } from 'react';

export const useModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updateUserInfo, setUpdateUserInfo] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleUpdate = () => {
        console.log('수정 로직실행');
    };

    return {
        isModalVisible,
        setIsModalVisible,
        updatePassword,
        setUpdatePassword,
        handleModalClose,
        handleUpdate,
        updateUserInfo,
        setUpdateUserInfo,
    };
};
