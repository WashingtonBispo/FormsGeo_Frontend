import styled from 'styled-components';

export const BodyContainer = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  background-color: #F5F5F5;
`;

export const UsersContainer = styled.div`
  background-color: white;
  max-width: 940px;
  margin: 0 auto;
  padding: 15px 5px 15px 5px;
  border: 1px solid black;
  border-radius: 8px;
  display: flex;
  flex-direction: column;

  .BorderUserContainer {
    border: 1px dotted #E4E6EF;
    margin: 15px 5px 15px 5px;
  }
`;

export const UserContainer = styled.div`
  width: 95%;
  height: 60px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UserInfor = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const UserOptions = styled.div`
  width: 150px;
`;