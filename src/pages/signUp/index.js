import React, {useState} from "react";
import { 
  Input, 
  InputGroup, 
  InputRightElement, 
  Button, 
  Text 
} from '@chakra-ui/react'

import {
  Container,
  FormContainer,
  ImageAreaContainer
} from './styles';

import bg from '../../assets/pages/signUp/Background.png'

const SignUp = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [show, setShow] = useState(false);
  
  const handleClick = () => setShow(!show);

  const handleChangeName = (event) => setName(event.target.value);

  const handleChangeEmail = (event) => setEmail(event.target.value);

  const handleChangePassword = (event) => setPassword(event.target.value);

  const handleSubmitForms = () => {
    alert('Usuário cadastrado!');
  }

  return (
    <>
    <Container>
      <FormContainer>
        <div className="LoginContainer">
          <h1>Cadastro</h1>
          <p>Já possui conta? <a>Acesse por aqui!</a></p>
        </div>
        <div className="InputsContainer">
          <div className="InputContainer">
            <Text mb='8px'>Nome completo</Text>
            <InputGroup size='md'>
              <Input
                value={name}
                onChange={handleChangeName}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
          </div>
          <div className="InputContainer">
            <Text mb='8px'>E-mail</Text>
            <InputGroup size='md'>
              <Input
                value={email}
                onChange={handleChangeEmail}
                pr='4.5rem'
                type='text'
                />
            </InputGroup>
          </div>
          <div className="InputContainer">  
            <Text mb='8px'>Senha</Text>
            <InputGroup size='md'>
              <Input
                value={password}
                onChange={handleChangePassword}
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Esconder' : 'Visualizar'}
                </Button>
              </InputRightElement>
            </InputGroup>
          </div>
        </div>

        <Button size='md' onClick={handleSubmitForms}>
          Button
        </Button>
      </FormContainer>
      <ImageAreaContainer>
        <p>Realize sua coleta de dados com geolocalização agora!</p>
        <img src={bg} />
      </ImageAreaContainer>
    </Container>
    </>
  );
};

export default SignUp;