import styled from 'styled-components';

export const PNContainer = styled.div`
  display: flex;
  height: 90px;
`;

export const PNFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  width: 60%;

  h1 {
    font-size: 48px;
    font-weight: bold;
    color: #20D489;
  }
`;

export const PNImageAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  align-items: flex-start;
  justify-content: flex-end;
  background-color: #20D489;

  h1 {
    font-size: 48px;
    font-weight: bold;
    color: white;
  }
`;

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 90px);
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;

  .LoginContainer {
    width: 100%;
    max-width: 400px;
    display: flex;
    align-items: flex-start;
    justify-content: left;
    flex-direction: column;
  }

  .LoginContainer .LoginLink{
    display: flex;
    justify-content: left;
    flex-direction: row;
  }

  .InputsContainer {
    width: 100%;
    max-width: 400px;
  }

  .InputContainer{
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }
`;

export const ImageAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  align-items: center;
  justify-content: center;
  background-color: #20D489;

  p {
    max-width: 300px;
    font-size: 24px;
    color: white;
    margin-bottom: 60px;
  }

  img {
    width: 60%;
    border-radius: 50%;
  }
`;
