import { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';

interface CreateHandlerProps {
    recipeId: number;
    comment: string;
    rating: number;
}
interface UpdateHandlerProps {
    commentId: number;
    comment: string;
    rating: number;
}
interface EditingProps {
    commentId: number;
    comments: string;
    commentRate: number;
}
interface CommentDataProps {
    commentAuthor: string;
    commentContent: string;
    commentId: number;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

export default function useComments() {
    const [editing, setEditing] = useState<boolean>(false); // 수정 중인지 check
    const [commentDataList, setCommentDataList] = useState<CommentDataProps[]>([]);
    const [recipeId, setRecipeId] = useState<number>();
    const [commentId, setCommentId] = useState<number>();
    const [createComment, setCreateComment] = useState<string>('');
    const [updateComment, setUpdateComment] = useState<string>('');
    const [currentRate, setCurrentRate] = useState<number>(0);
    const [responseMessage, setResponseMessage] = useState<string>(''); // 메시지 알람창

    // 세션에 저장된 토큰
    const token = sessionStorage.getItem('token');

    // get : recipeId
    const fetchCommentHandler = async (recipeId: string) => {
        try {
            const response: any = await axios.get(`${import.meta.env.VITE_BASE_URL}/comments/${recipeId}`, {
                headers: {
                    'access-token': `Bearer ${token}`,
                },
                withCredentials: true,
            });
            if (response.data.code === 'OK') {
                console.log('response.data.data: ', response.data.data);
                setCommentDataList(response.data.data.comments);
            }
            console.log('너는 몇번째임?');
        } catch (err) {
            console.log(err);
            alert('댓글을 가져오는데 실패했습니다.');
        }
    };
    console.log('comment-commentId: ', commentId);
    console.log('comment-updateComment:  ', updateComment);
    console.log(recipeId);

    // create : recipeId, comment, rating
    const createCommentHandler = async (e: FormEvent<HTMLFormElement>, { recipeId, comment, rating }: CreateHandlerProps) => {
        e.preventDefault();
        setRecipeId(recipeId);
        setCurrentRate(rating);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/comments`,
                {
                    recipeId: recipeId,
                    comment: comment,
                    rating: rating,
                },
                {
                    headers: {
                        'access-token': `Bearer ${token}`,
                    },
                    withCredentials: true,
                },
            );
            console.log('comment create response: ', response);
            console.log('comment response message:', response.data.message);
            console.log('rating, comment', rating, comment);
            setResponseMessage(response.data.message);
            // ! 초기화 : 필요여부 체크(test필요)
            setCreateComment('');
            setCurrentRate(0);
            await fetchCommentHandler(recipeId.toString());
        } catch (err: any) {
            console.log(err);
            alert('댓글 작성에 실패하였습니다.');
        }
    };

    // update : commentId, comment, rating
    const updateCommentHandler = async ({ commentId, comment, rating }: UpdateHandlerProps, recipeId: string) => {
        setEditing(false); // 수정완료 : false로 상태변경
        try {
            const response: any = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/comments`,
                {
                    commentId: commentId,
                    comment: comment,
                    rating: rating,
                },
                {
                    headers: {
                        'access-token': `Bearer ${token}`,
                    },
                    withCredentials: true,
                },
            );

            console.log('rating, comment', rating, comment);

            if (response.staus === 200) {
                console.log('update response: ', response);
                setResponseMessage(response.data.message);
                // 초기화 -> 안하면 다시 수정 버튼 눌렀을때 어떻게 반영되는지 확인
                setCurrentRate(0);
                setUpdateComment('');
                setCommentId(0);
                await fetchCommentHandler(recipeId);
                alert('댓글이 수정되었습니다.');
            }
        } catch (err) {
            console.log(err);
            alert('댓글 수정에 실패하였습니다.');
        }
    };

    // 코멘트, 평점 update / create 핸들러
    const handleCreateComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCreateComment(e.target.value);
    };
    const handleUpdateComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUpdateComment(e.target.value);
    };
    const handleMakeRate = (rate: number) => {
        setCurrentRate(rate);
    };
    console.log(currentRate);

    // 코멘트 수정 버튼과 연결
    const handleClickEdit = ({ comments, commentId, commentRate }: EditingProps) => {
        setEditing(true);
        setCommentId(commentId); // 수정버튼 누른 commentId값 저장 => commentsDataList에서 같은 commentid값을 가진 코멘트 filter하기 위함
        setUpdateComment(comments);
        setCurrentRate(commentRate);
    };

    const deleteCommentHandler = async (commentId: number, recipeId: string) => {
        try {
            const response: any = await axios.delete(`${import.meta.env.VITE_BASE_URL}/comments`, {
                headers: {
                    'access-token': `Bearer ${token}`,
                },
                data: {
                    commentId: commentId,
                },
                withCredentials: true,
            });
            console.log('delete response: ', response);
            setResponseMessage(response.data.message);
            console.log(responseMessage);
            await fetchCommentHandler(recipeId);
            alert('댓글이 삭제되었습니다.');
            //  ! comments 리렌더링 조건 추가 필요 삭제 / 수정 / 생성 될때마다 알아서 호출되도록 구현
            // 현재는 comments를 새로 생성하지 않고 삭제만 했음 - useEffect 동작 이유 없음
        } catch (err) {
            console.log(err);
            alert('댓글 삭제에 실패하였습니다.');
        }
    };

    return {
        editing,
        handleClickEdit,
        commentId,
        currentRate,
        createComment,
        updateComment,
        commentDataList,
        fetchCommentHandler,
        createCommentHandler,
        updateCommentHandler,
        deleteCommentHandler,
        handleCreateComment,
        handleUpdateComment,
        handleMakeRate,
    };
}
