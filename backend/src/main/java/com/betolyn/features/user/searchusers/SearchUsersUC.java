package com.betolyn.features.user.searchusers;

import java.util.List;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.user.UserEntity;
import com.betolyn.features.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SearchUsersUC implements IUseCase<SearchUsersParams, List<UserEntity>> {
    private final UserRepository userRepository;

    @Override
    public List<UserEntity> execute(SearchUsersParams param) {
        String formattedEmail = null;

        var isValidEmail = EmailValidator.getInstance().isValid(param.email());
        if (isValidEmail) {
            formattedEmail = param.email();
        }

        return userRepository.findAllByQueryStrings(param.id(), param.username(), formattedEmail);
    }
}
