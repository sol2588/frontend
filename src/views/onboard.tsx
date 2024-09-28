import "../App.css";
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 스타일드 컴포넌트 부분 시작 //

//레이아웃
export const Layout = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: black;
`;
//로고영역

//로고div
const LogoDiv = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  gap: 200px;
  margin-left: 500px;

  .title-wrapper {
    display: flex;
    flex-direction: column;
  }
  span {
    color: gray;
    text-align: left;
  }

  strong {
    color: black;
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
  }
`;

//로고
const LogoBtn = styled.button`
  width: 80px;
  height: 50px;
  margin-left: 220px;
  background-color: white;

  color: black;
  border: 1px solid black;
  font-weight: bold;
`;

//버튼
const Button = styled.button`
  width: 150px;
  height: 50px;
  background-color: black;
  color: white;
  border-radius: 10px;
`;

//추천아이템 섹션
const RecomendItems = styled.section`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
`;

const RecomendItem = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  width: 350px;
  padding: 20px;

  span {
    color: black;
  }
`;

//버튼섹션
const ButtonSection = styled.section`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 200px;
`;

// 스타일드 컴포넌트 부분 끝//

const Onboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Layout>
        <LogoDiv>
          <LogoBtn>Logo</LogoBtn>
          <div className="title-wrapper">
            <span>자만추에서는</span>
            <strong>한번의 클릭으로, 다양한 요리를!</strong>
          </div>
        </LogoDiv>
        <RecomendItems className="recomend-items">
          <RecomendItem>
            <img
              src="https://thumb.ac-illust.com/73/7387030e5a5600726e5309496353969a_t.jpeg"
              alt="이미지"
            ></img>
            <span>자취할때 어떻게 요리를 선택하시나요 ?</span>
          </RecomendItem>
          <RecomendItem>
            <img
              src="https://thumb.ac-illust.com/73/7387030e5a5600726e5309496353969a_t.jpeg"
              alt="이미지"
            ></img>
            <span>좋아하는 요리를 선택해 오늘의 요리를 추천받아보세요.</span>
          </RecomendItem>
          <RecomendItem>
            <img
              src="https://thumb.ac-illust.com/73/7387030e5a5600726e5309496353969a_t.jpeg"
              alt="이미지"
            ></img>
            <span>원하는 요리를 직접 고를수도 있어요</span>
          </RecomendItem>
          <RecomendItem>
            <img
              src="https://thumb.ac-illust.com/73/7387030e5a5600726e5309496353969a_t.jpeg"
              alt="이미지"
            ></img>
            <span>나중에 도전하고 싶은 요리는 저장해 놓을 수 있어요</span>
          </RecomendItem>
        </RecomendItems>
        <ButtonSection>
          <Button onClick={() => navigate("/signup")}>Join</Button>
          <Button onClick={() => navigate("/guesthome")}>둘러보기</Button>
        </ButtonSection>
      </Layout>
    </>
  );
};

export default Onboard;
