import { useState } from 'react';
export const useModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updateUserInfo, setUpdateUserInfo] = useState('');
    const [updatePassword, setUpdatePassword] = useState('');
    const [isCheckModal, setIsCheckModal] = useState(false);
    const [isPasswordModal, setIsPasswordModal] = useState(false);
    const [isDelUserModal, setIsDelUserModal] = useState(false);
    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleConfirm = () => {
        setIsModalVisible(false);
    };

    const handlePasswordModalOpen = () => {
        setIsPasswordModal(true);
    };

    const handlePasswordModalClose = () => {
        setIsPasswordModal(false);
    };
    const handleCheckModalOpen = () => {
        setIsCheckModal(true);
    };

    const handleCheckModalClose = () => {
        setIsCheckModal(false);
    };

    const handleUpdate = () => {
        console.log('수정 로직실행');
    };

    const handleDelUserOpen = () => {
        setIsDelUserModal(true);
    };

    const handleDelUserClose = () => {
        setIsDelUserModal(false);
    };

    return {
        setIsModalVisible,
        isModalVisible,
        updatePassword,
        setUpdatePassword,
        updateUserInfo,
        setUpdateUserInfo,
        isCheckModal,
        isPasswordModal,
        openModal,
        closeModal,
        handleConfirm,
        handlePasswordModalOpen,
        handlePasswordModalClose,
        handleCheckModalOpen,
        handleCheckModalClose,
        handleUpdate,
        handleDelUserOpen,
        handleDelUserClose,
        isDelUserModal,
    };
};
