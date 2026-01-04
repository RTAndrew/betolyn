package com.betolyn.features.user;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    Optional<UserEntity> getUserById(String id);
    UserDTO findByUsername(String username);
    List<UserEntity> getUsers();
}

