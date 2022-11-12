import React from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch, } from "react-redux";

import jwt_decode from "jwt-decode";

import authAction from "../../store/action/auth";

import { 
  Text
} from '@chakra-ui/react'

import {
  HeaderContainer,
  HeaderPagesContainer,
  HeaderUserContainer
} from './styles';

const Header = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.authReducer.token);
  const decoded = !!token ? jwt_decode(token) : null;

  const handleLogOff = () => {
    dispatch(
      authAction.logOut()
    );
  }

  return (
    <>
        <HeaderContainer>
          <HeaderPagesContainer>
            <Link to="/">
              <Text fontSize='18px' color="#FFFFFF" marginRight="8px">
                Pesquisas
              </Text>
            </Link>
            {decoded.role == "Admin" ? (
              <Link to="/usuarios">
                <Text fontSize='18px' color="#FFFFFF" marginRight="8px">
                  Usuários
                </Text>
              </Link>
            ) : (
              <></>
            )}
            
            <Link to="/perfil">
              <Text fontSize='18px' color="#FFFFFF">
                Perfil
              </Text>
            </Link>
          </HeaderPagesContainer>
          
          <HeaderUserContainer>
            <div>
              <Text fontSize='12px' color="#FFFFFF">{decoded.name}</Text>
              <Text fontSize='12px' color="#FFFFFF">{decoded.role}</Text>
            </div>
            <label>{decoded.name.charAt(0)}</label>
            <button onClick={handleLogOff}>
              <Text marginLeft="8px" fontSize='18px' color="#FFFFFF">Sair</Text>
            </button>
          </HeaderUserContainer>
        </HeaderContainer>
    </>
  );
};

export default Header;