package com.betolyn.features.user.findallusers;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindAllUsersUC implements IUseCaseNoParams<List<UserEntity>> {
    private final UserRepository userRepository;

    @Override
    public List<UserEntity> execute() {
        return userRepository.findAll();
    }
}
