import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthToken from './useAuthToken';
export const useGetMyRecipes = (myRecipesPage: number, scrapedRecipesPage: number) => {
    interface Recipe {
        recipeId: number;
        recipeName: string;
        recipeThumbnail: string;
    }
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [scrapedRecipes, setScrapedRecipes] = useState<Recipe[]>([]);
    const [totalMyRecipesPages, setTotalMyRecipesPages] = useState(1); // 총 작성 레시피 페이지 수
    const [totalScrapedRecipesPages, setTotalScrapedRecipesPages] = useState(1); // 총 스크랩 레시피 페이지 수
    const navigate = useNavigate();

    const token = useAuthToken();

    useEffect(() => {
        const fetchRecipes = async () => {
            if (!token) {
                alert('잘못된 접근입니다.');
                navigate('/login');
                return;
            }
            try {
                console.log('마이페이지레시피 목록 api호출시작');
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/recipes?myRecipePage=${myRecipesPage}&scrapRecipePage=${scrapedRecipesPage}`,
                    {
                        headers: {
                            'access-token': `Bearer ${token}`,
                        },
                        withCredentials: true,
                    },
                );
                console.log('마이페이지 작성게시글, 스크랩목록', response);
                if (response.data.body.code === 'OK') {
                    // API 응답 데이터를 사용하여 상태 업데이트
                    setMyRecipes(response.data.body.data.myRecipes.dataList);
                    setScrapedRecipes(response.data.body.data.myScrapedRecipes.dataList);
                    // 총 페이지 수 업데이트
                    setTotalMyRecipesPages(response.data.body.data.myRecipes.totalPage);
                    setTotalScrapedRecipesPages(response.data.body.data.myScrapedRecipes.totalPage);
                }
            } catch (error) {
                console.error('게시물 정보를 불러오는데 실패하였습니다', error);
            }
        };
        fetchRecipes();
    }, [myRecipesPage, scrapedRecipesPage]);

    return {
        myRecipes,
        scrapedRecipes,
        totalMyRecipesPages,
        totalScrapedRecipesPages,
    };
};
