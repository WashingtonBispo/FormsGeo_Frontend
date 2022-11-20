import styled from 'styled-components';

export const BodyContainer = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  background-color: #F5F5F5;
  display: flex;
`;

export const QuestionsListContainer = styled.div`
  width: 100%;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 1px dotted #E4E6EF;
  border-radius: 8px;
`;

export const AddQuestionContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const AddQuestionBody = styled.div`
  width: 100%;
`;

export const AddQuestionButtonContainer = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
`;

export const ButtonIconContainer = styled.div`
`;
