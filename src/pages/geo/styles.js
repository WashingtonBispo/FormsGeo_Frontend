import styled from 'styled-components';

export const BodyContainer = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  background-color: #F5F5F5;
`;

export const ResearchsContainer = styled.div`
  background-color: #F5F5F5;
  width: 100%;
  padding-top: 50px;
  display:flex;
  justify-content: center;
  align-items: center;
`;

export const InforContainer = styled.div`
  width: 30%;
`;

export const QuestionContainer = styled.div`
  margin-top: 12px;
`;

export const SwitchContainer = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
`;

export const MapBodyContainer = styled.div`
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;

  .leaflet-container{
    width: 800px;
    height: 400px;
  }
`;

export const ButtonContainer = styled.div`
  margin: 0 auto;
  width: 95%;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;
