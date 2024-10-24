// 이메일 유효성 검사
export const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return '이메일을 입력하세요';
    if (!emailRegex.test(email)) return '이메일 형식이 올바르지 않습니다';
    return '';
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string): string => {
    if (!password) return '비밀번호를 입력하세요';
    if (password.includes(' ')) return '비밀번호에 공백을 포함할 수 없습니다';
    if (password.length < 8 || password.length > 16) return '비밀번호는 8자 이상 16자 이하로 입력해주세요';
    return '';
};

// 비밀번호 확인 유효성 검사
export const validatePasswordCheck = (newPassword: string, passwordCheck: string): string => {
    if (!passwordCheck) return '비밀번호 확인을 입력하세요';
    if (newPassword !== passwordCheck) return '비밀번호가 일치하지 않습니다';
    return '';
};

//새로운비밀번호 확인 유효성 검사
export const validateNewPasswordCheck = (newPassword: string): string => {
    if (!newPassword) return '변경할 비밀번호 확인란을 입력하세요.';
    if (newPassword.includes(' ')) return '비밀번호에 공백을 포함할 수 없습니다';
    if (newPassword.length < 8 || newPassword.length > 16) return '비밀번호는 8자 이상 16자 이하로 입력해주세요';
    return '';
};

// 닉네임 유효성 검사
export const validateNickname = (nickname: string): string => {
    if (!nickname) return '닉네임을 입력하세요';
    return '';
};

interface ValidationSignupProps {
    email: string;
    password: string;
    passwordCheck: string;
    nickname: string;
}
interface ValidationLoginProps {
    email: string;
    password: string;
}

interface UserInfoValidationProps {
    password: string;
    newPassword: string;
    passwordCheck?: string;
    nickname?: string;
}

// 회원가입 유효성 검사 결과 (success or fail)
export const validateSignup = ({ email, password, passwordCheck, nickname }: ValidationSignupProps) => {
    return {
        email: validateEmail(email),
        password: validatePassword(password),
        passwordCheck: validatePasswordCheck(password, passwordCheck),
        nickName: validateNickname(nickname),
    };
};

export const validateLogin = ({ email, password }: ValidationLoginProps) => {
    return {
        email: validateEmail(email),
        password: validatePassword(password),
    };
};

export const validateUserIfno = ({ password, newPassword, passwordCheck, nickname }: UserInfoValidationProps) => {
    return {
        password: validatePassword(password),
        newPassword: validateNewPasswordCheck(newPassword),
        passwordCheck: passwordCheck ? validatePasswordCheck(newPassword, passwordCheck) : '',
        nickName: nickname ? validateNickname(nickname) : '',
    };
};
