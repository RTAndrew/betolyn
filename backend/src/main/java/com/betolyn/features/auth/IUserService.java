package com.betolyn.features.auth;

import java.util.List;

public interface IUserService {
    UserEntity getUserById(String id);
    UserEntity getUserByEmail(String email);

    List<UserEntity> getUsers();
}

