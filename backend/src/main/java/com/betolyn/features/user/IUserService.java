package com.betolyn.features.user;

import java.util.List;

public interface IUserService {
    UserEntity getUserById(String id);
    UserEntity getUserByEmail(String email);
    List<UserEntity> getUsers();
}

