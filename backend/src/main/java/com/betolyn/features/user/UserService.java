package com.betolyn.features.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserEntity getUserById(String id) throws NoSuchElementException {
        return userRepository.findById(id).orElseThrow();
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
