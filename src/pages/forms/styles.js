import styled from 'styled-components';

export const BodyContainer = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  background-color: #F5F5F5;
`;

export const SearchContainer = styled.div`
  width: 100%;
  padding-bottom: 20px;
  background-color: #F5F5F5;
  margin: 0 auto;
`;

export const ResearchsContainer = styled.div`
  background-color: #F5F5F5;
  max-width: 1400px;
  width: 96%;
  margin: 0 2%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const ResearchContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 18px 1%;
`;

export const AboutContainer = styled.div`
  margin: 0 1% 18px 1%;
`;

export const InforContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const AddResearchContainer = styled.div`
  .img-icon {
    cursor: pointer;
    margin-bottom: 8px;
    display: flex;
    flex-direction: row;
    align-items: center
  }
`;
