package com.betolyn.features.user.finduserbyusername;

import com.betolyn.features.IUseCase;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserNotFoundException;
import com.betolyn.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FindUserByUsernameUC implements IUseCase<String, UserEntity> {
    private final UserRepository userRepository;

    @Override
    public UserEntity execute(String username) throws UserNotFoundException {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException();
        }
        return user;
    }
}
