import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipeCreate } from './useRecipeCreate';
import useAuthToken from './useAuthToken';
import instance from '../utils/api/instance';
import DefaultImg from '../assets/img/defaultImg.jpeg';
import axios from 'axios';
export const useUpdateRecipes = (id: string | undefined) => {
    const navigate = useNavigate();
    const token = useAuthToken();
    const [userNickname, setUserNickname] = useState(''); // 로그인된 유저의 닉네임
    const [isAuthor, setIsAuthor] = useState(false); // 작성자 여부 확인용
    const {
        setRecipeName,
        setRecipeLevel,
        setRecipeCookingTime,
        setIngredients,
        setSteps,
        recipeName,
        recipeLevel,
        recipeCookingTime,
        ingredients,
        steps,
        setImagePreviews,
        thumbnailPreview,
        setThumbnailPreview,
        thumbnailFile,
        setThumbnailFile,
        handleThumbnailChange,
    } = useRecipeCreate();

    // 1. 로그인된 유저의 닉네임 가져오기
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const response = await instance.get('/users');
                console.log('게시물수정 유저정보', response);
                setUserNickname(response.data.data.nickname);
            } catch (error) {
                console.error('유저 정보를 불러오는 데 실패했습니다', error);
                navigate('/login');
            }
        };
        fetchUserInfo();
    }, [navigate]);

    // 2. 레시피 데이터 불러오기 및 작성자 확인
    useEffect(() => {
        const fetchRecipeData = async () => {
            try {
                const response = await instance.get(`/recipes/${id}`);
                console.log('게시물수정 레시피데이터', response);
                console.log('게시물수정 레시피데이터.data', response.data);

                const recipeData = response.data.data;

                // API에서 반환된 `recipeAuthor`와 로그인된 유저의 닉네임을 비교
                if (recipeData.recipeAuthor !== userNickname) {
                    alert('이 레시피를 수정할 권한이 없습니다.');
                    navigate(`/recipes/${id}`);
                    return;
                }

                // 작성자일 경우 레시피 데이터를 상태에 저장
                setIsAuthor(true);
                setRecipeName(recipeData.recipeName);
                setRecipeLevel(recipeData.recipeLevel);
                setRecipeCookingTime(recipeData.recipeCookingTime);
                setIngredients(recipeData.recipeIngredients);

                // Steps 데이터를 변환하여 상태에 저장
                const stepsData =
                    recipeData.recipesManuals?.map((manual: any) => ({
                        content: manual.recipeOrderContent,
                        picture: manual.recipeOrderImage || null,
                    })) || [];
                setSteps(stepsData);

                // 이미지 미리보기 데이터를 동기화
                const imagePreviewsData = recipeData.recipesManuals?.map((manual: any) => manual.recipeOrderImage || DefaultImg) || [];
                setImagePreviews(imagePreviewsData);

                console.log('recipeData.recipeName :', recipeData.recipeName);
                console.log('recipeData.recipeLevel :', recipeData.recipeLevel);
                console.log('recipeData.recipeCookingTime :', recipeData.recipeCookingTime);
                console.log('recipeData.recipeIngredients :', recipeData.recipeIngredients);
                console.log('recipeData.recipesManuals :', recipeData.recipesManuals);
            } catch (error) {
                console.error('레시피 데이터를 불러오는 데 실패했습니다', error);
                navigate('/recipes');
            }
        };

        if (userNickname) {
            fetchRecipeData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate, userNickname]);

    // 3. 레시피 수정 요청
    const handleUpdateRecipe = async () => {
        if (!isAuthor) {
            alert('이 레시피를 수정할 권한이 없습니다.');
            return;
        }
        if (!id) {
            alert('레시피 ID가 없습니다.');
            return;
        }
        try {
            // 1. S3에 썸네일 이미지 업로드
            let thumbnailUrl = '';
            console.log(' 1. thumbnail : ', thumbnailFile);
            if (thumbnailFile) {
                const formDataThumbnail = new FormData();
                formDataThumbnail.append('recipeThumbnail', thumbnailFile);

                console.log('recipeName :', recipeName);
                const s3ThumbnailResponse = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/pictures/thumbnail?recipeName=${recipeName}`,
                    formDataThumbnail,
                    {
                        headers: {
                            'access-token': `Bearer ${token}`,
                        },
                    },
                );
                console.log('s3Thumbnail Response : ', s3ThumbnailResponse);
                console.log('s3Thumbnail Response.data : ', s3ThumbnailResponse.data);
                //! response된 값 보고 수정필요
                thumbnailUrl = s3ThumbnailResponse.data;
            }
            console.log(' 1. thumbnailUrl : ', thumbnailUrl);

            // 2. S3에 조리 순서 이미지 업로드
            const formDataOrderImages = new FormData();
            steps.forEach((step) => {
                if (step.picture) {
                    formDataOrderImages.append('recipeOrderImages', step.picture);
                }
            });
            console.log('2.formDataOrderImages : ', formDataOrderImages);

            const s3OrderImagesResponse = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/pictures/orderImages?recipeName=${recipeName}`,
                formDataOrderImages,
                {
                    headers: {
                        'access-token': `Bearer ${token}`,
                    },
                },
            );
            console.log('s3OrderImageResponse : ', s3OrderImagesResponse);
            console.log('s3OrderImageResponse.data : ', s3OrderImagesResponse.data);
            //! response된 값 보고 수정필요
            const orderImageUrls = s3OrderImagesResponse.data; // 조리 과정 이미지 URL 배열

            const recipeData = {
                recipeName: recipeName,
                recipeLevel: recipeLevel,
                recipeCookingTime: recipeCookingTime,
                // recipeThumbnail: thumbnailUrl,
                recipeIngredients: ingredients.map((ingredient) => ({
                    ingredientName: ingredient.ingredientName,
                    ingredientQuantity: ingredient.ingredientQuantity,
                })),
                recipeOrderContents: steps.map((step) => ({
                    recipeOrderContent: step.content,
                    // recipeOrderImage: orderImageUrls[index] || '',
                })),
            };

            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/recipes?thumbnailUrl=${thumbnailUrl}&recipeOrderImagesUrl=${orderImageUrls.join(',')}`,
                recipeData,
                {
                    headers: {
                        'access-token': `Bearer ${token}`,
                    },
                },
            );
            console.log('레시피수정 최종 response : ', response);
            console.log('레시피수정 최종 response.data : ', response.data);
            if (response.data.code === 'UPDATED') {
                alert('레시피가 성공적으로 수정되었습니다.');
                navigate(`/recipes/${id}`);
            }
        } catch (error) {
            console.error('레시피 수정 실패 :', error);
            alert('레시피 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };
    return {
        recipeName,
        setRecipeName,
        recipeLevel,
        setRecipeLevel,
        recipeCookingTime,
        setRecipeCookingTime,
        ingredients,
        setIngredients,
        steps,
        setSteps,
        handleUpdateRecipe,
        thumbnailPreview,
        handleThumbnailChange,
        setThumbnailPreview,
        thumbnailFile,
        setThumbnailFile,
    };
};
