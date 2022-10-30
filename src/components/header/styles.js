import styled from 'styled-components';

export const HeaderContainer = styled.div`
  padding: 12px;
  background-color: #20D489;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderPagesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderUserContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  label{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    font-size: 18px;
    font-weight: bold;
    background-color: #265441;
    color: white;
  }
`;