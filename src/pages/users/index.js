import React, { useCallback, useEffect } from "react";
import { useToast } from '@chakra-ui/react'

import { 
  Tag,
  TagLabel,
  Text,
  InputGroup,
  Input
} from '@chakra-ui/react';

import {
  Select,
} from "chakra-react-select";

import { api } from "../../services/api";

import Header from "../../components/header";
import CurrentRoute from "../../components/currentRoute";

import {
  UserContainer,
  UsersContainer,
  UserInfor,
  UserOptions,
  BodyContainer,
  SearchContainer
} from './styles';

const Users = () => {
  const [users, setUsers] = React.useState([]);
  const [searchInfor, setSearchInfor] = React.useState('');
  const [count, setCount] = React.useState(0);

  const toast = useToast();

  const showErrorToast = useCallback((message) => {
    toast({
      title: message,
      position: "top-right",
      status: "error",
      isClosable: true,
    });
  }, [toast]);

  const getUsers = useCallback(async (filter) => {
    try 
    {
      const responseData = await api.get("User/List", { params: { filter: filter } });

      setUsers(responseData.data);
    } catch (e)
    {
      showErrorToast("Ocorreu um erro ao listar os usuários.");
    }
  }, [showErrorToast])

  useEffect(() => {
    getUsers();
  },[showErrorToast, count, getUsers]);

  const handleChangeSearchInfor = useCallback((event) => {
    const currentSearchInfor = event.target.value;

    setSearchInfor(currentSearchInfor);

    if (currentSearchInfor.length >= 3){
      getUsers(currentSearchInfor);
    }else{
      getUsers();
    }
  }, [getUsers])

  const userOptionHandle = (e, email) => {
    switch(e.value){
      case "Ativar":
        enableUser(email);
        break;
      case "Desativar":
        disableUser(email);
        break;
      case "Deletar":
        deleteUser(email);
        break;
    }
  };

  const enableUser = (email) => {
    const HandleUser = async (email) => {
      try{
        const userData = {
          email,
          status: 1
        };
        
        await api.put("User/status", userData);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast("Ocorreu um erro ao ativar usuário.");
      }
    }

    HandleUser(email);
  };

  const disableUser = (email) => {
    const HandleUser = async (email) => {
      try{
        const userData = {
          email,
          status: 2
        };
        
        await api.put("User/status", userData);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast("Ocorreu um erro ao desativar um usuário.");
      }
    }

    HandleUser(email);
  };

  const deleteUser = (email) => {
    const HandleUser = async (email) => {
      try{
        const userData = {
          email
        };
        
        await api.delete("User", userData);
        setCount(count + 1);
      }
      catch (err){
        showErrorToast("Ocorreu um erro ao deletar usuário.");
      }
    }

    HandleUser(email);
  };

  return (
    <>
      <Header />

      <CurrentRoute name={"Usuários"} route={"Usuários"}/>

      <SearchContainer>
        <InputGroup size='md'>
          <Input
            value={searchInfor}
            onChange={handleChangeSearchInfor}
            placeholder="Buscar usuários"
            backgroundColor="#DDDDDD"
            maxWidth='800px'
            margin="0 auto"
            pr='4.5rem'
            type='text'
            />
        </InputGroup>
      </SearchContainer>
      
      <BodyContainer>
        <UsersContainer>
          <Text 
            fontSize='18px' 
            color="#3F4254" 
            marginLeft="8px"
            fontWeight="bold"
          >
            Usuários
          </Text>
          
          <div className="BorderUserContainer">
            {users.map((user) => {
              return (
                <UserContainer>
                  <UserInfor>
                    <Tag 
                      size={"md"} 
                      key={"md"} 
                      variant='subtle' 
                      color={user.status === 1 ? '#62DBA9' : '#F64E60'}
                      marginRight='15px'
                      >
                      <TagLabel>{user.status === 1 ? "Ativo" : "Inativo"}</TagLabel>
                    </Tag>

                    <p1>{user.email}</p1>
                  </UserInfor>

                  <UserOptions>
                    <Select
                      className="basic-single"
                      placeholder="Opções"
                      onChange={(e) => {userOptionHandle(e, user.email)}}
                      options={[
                        {
                          label: "Ativar",
                          value: "Ativar",
                        },
                        {
                          label: "Desativar",
                          value: "Desativar",
                        },
                        {
                          label: "Deletar",
                          value: "Deletar"
                        }
                      ]}
                      />
                  </UserOptions>
                </UserContainer>
              );
            })}
          </div>
          
        </UsersContainer>
      </BodyContainer>
    </>
  );
};

export default Users;
