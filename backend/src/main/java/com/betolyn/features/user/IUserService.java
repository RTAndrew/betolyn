package com.betolyn.features.user;

import java.util.List;

public interface IUserService {
    UserEntity getUserById(String id);
    UserDTO findByUsername(String username);
//    UserEntity getUserByEmail(String email);
    List<UserEntity> getUsers();
}

