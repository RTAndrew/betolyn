package com.betolyn.features.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public Optional<UserEntity> getUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public UserDTO findByUsername(String username) {
        var user = userRepository.findByUsername(username);
        return userMapper.toDTO(user);
    }

    @Override
    public List<UserEntity> getUsers() {
        return userRepository.findAll();
    }
}
