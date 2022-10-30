import styled from 'styled-components';

export const BodyContainer = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  background-color: #F5F5F5;
`;

export const UserContainer = styled.div`
  background-color: white;
  max-width: 940px;
  margin: 0 auto;
  padding: 15px 5px 15px 5px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;


export const UserInforContainer = styled.div`
  width: 95%;
  margin: 0 auto;
  margin-left: "8px";
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;


  .InputContainer{
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }
`;

export const ButtonContainer = styled.div`
  width: 95%;
  display: flex;
  justify-content: right;
`;
