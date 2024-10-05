import { useNavigate } from 'react-router-dom';
import KakoLogin from 'react-kakao-login';
import axios from 'axios';

export default function SocialKakao() {
    const navigate = useNavigate();
    const javaScriptKey = import.meta.env.VITE_JAVASCRIPT_KEY;

    const kakaoOnSuccess = async (data: any) => {
        const idToken = data.response.access_token;
        console.log(data);
        try {
            const response: any = await axios.post(`${import.meta.env.VITE_BASE_URL}/oauth2/authorization/kakao`, {
                access_token: idToken,
                authProvider: 'kakao',
            });
            if (response.code == 200) {
                console.log(response);
                localStorage.setItem('kakao_access_token', JSON.stringify(response.data));
                navigate('/main');
            }
        } catch (err) {
            console.log(err);
            alert('로그인에 실패했습니다.');
        }
    };
    const kakaoOnFailure = (err: any) => {
        console.log(err);
    };
    return <KakoLogin token={javaScriptKey} onSuccess={kakaoOnSuccess} onFail={kakaoOnFailure} />;
}