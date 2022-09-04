import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;

  .InputContainer{
    display: flex;
    flex-direction: column;
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
    color: white;
  }
`;
