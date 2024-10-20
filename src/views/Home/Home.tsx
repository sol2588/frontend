import { ChangeEvent, useState } from 'react';
import AllRecipes from '../Recipes/AllRecipes/AllRecipes';
import PopularRecipesView from '../Recipes/PopularRecipes/PopularRecipesView';
import RecommendedRecipes from '../Recipes/RecommendedRecipes/RecommendedRecipes';
import styled from 'styled-components';
// import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
// import { useLocation } from 'react-router-dom';
import mainImage from '../../assets/img/spoon.jpg';
import Visited from '../Visited/Visited';
import withAuth from '../../hooks/withAuth';

function Home(): JSX.Element {
    const [searched, setSearched] = useState<string>('');
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    // const [message, setMessage] = useState<string>('');

    // const { pathname } = useLocation();
    // const isMain = pathname == '/homde';

    const changeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        setSelectedIngredients(search.split(' '));
        setSearched(search);
    };

    const handleSubmit = async () => {
        if (searched === '') {
            alert('검색어를 입력해주세요');
        } else {
            alert(selectedIngredients);
        }
        // const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/recipes/search`);
        // ! 데이터 들어오는 구조 확인 - 데이터 받아오면 setSelectedIngredients 데이터 가공해서 화면 렌더링 처리
        try {
        } catch (err: any) {
            console.log(err);
            // setMessage(err);
        }
    };

    const handleActiveEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };
    return (
        <S_MainContainer>
            <S_MainImage src={mainImage} alt="메인페이지 이미지" />
            <S_SearchWrapper>
                <S_SearchBox
                    type="text"
                    value={searched}
                    onChange={(e) => changeInputHandler(e)}
                    onKeyDown={(e) => handleActiveEnter(e)}
                    placeholder="재료를 입력해주세요."
                />
                <S_SearchIcon onClick={handleSubmit} />
            </S_SearchWrapper>
            {/* 리덕스 툴킷 도입 : 레시피페이지 전역상태관리 - RecipePageHeader + RecipeList 호출가능?  */}
            <S_RecipeWrapper>
                <RecommendedRecipes limit={4} page="recommended" />
                <AllRecipes limit={1} page="all" />
                {/* Popular, Visited 분리 작업 후 VisitedWrapper는 float/position으로 css 변경처리 */}
                <S_VisitedPopularWrapper>
                    <PopularRecipesView limit={2} page="popular" />
                    <Visited />
                </S_VisitedPopularWrapper>
            </S_RecipeWrapper>
        </S_MainContainer>
    );
}
export default withAuth(Home);

const S_MainContainer = styled.section`
    background-color: #f5f4f3;
    min-height: 100vh;
`;
const S_MainImage = styled.img`
    display: block;
    width: 100%;
    height: 250px;
    object-fit: cover;
`;
const S_SearchWrapper = styled.div`
    width: 50%;
    margin: 16px auto;
    position: relative;
`;
const S_SearchBox = styled.input`
    display: block;
    width: 90%;
    height: 40px;
    padding-left: 16px;
    border: transparent;
    border-radius: 16px;
    color: black;
    background-color: rgba(239, 182, 63, 0.2);
`;
const S_SearchIcon = styled(CiSearch)`
    position: absolute;
    right: 15%;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    cursor: pointer;
`;
const S_RecipeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
const S_VisitedPopularWrapper = styled.div`
    display: flex;
    height: auto;
`;
