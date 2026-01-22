package com.betolyn.features.user.finduserbyid;

import com.betolyn.features.IUseCase;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserNotFoundException;
import com.betolyn.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindUserByIdUC implements IUseCase<String, UserEntity> {
    private final UserRepository userRepository;

    @Override
    public UserEntity execute(String userId) throws UserNotFoundException {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }
}
