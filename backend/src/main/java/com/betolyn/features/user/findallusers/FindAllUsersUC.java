package com.betolyn.features.user.findallusers;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindAllUsersUC implements IUseCase<Optional<List<String>>, List<UserEntity>> {
    private final UserRepository userRepository;

    @Override
    public List<UserEntity> execute(Optional<List<String>> userIds) {
        List<String> memberIds = userIds == null || userIds.isEmpty()
                ? List.of()
                : Objects.requireNonNullElse(userIds.get(), List.of());

        if (memberIds.isEmpty()) {
            return userRepository.findAll();
        }

        return userRepository.findAllById(memberIds);
    }
}
