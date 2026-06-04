package com.betolyn.features.spaces.findspacecandidatemembers;

import java.util.List;

import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.spaces.SpaceUsersRepository;
import com.betolyn.features.user.UserEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindSpaceCandidateMembersUC implements IUseCase<FindSpaceCandidateMembersParams, List<UserEntity>> {
    private final SpaceUsersRepository spaceUsersRepository;

    @Override
    public List<UserEntity> execute(FindSpaceCandidateMembersParams param) {
        if (param.query() == null || param.query().isBlank()) {
            return List.of();
        }

        String email = null;
        if (EmailValidator.getInstance().isValid(param.query())) {
            email = param.query();
        }

        return spaceUsersRepository.findUsersNotMemberOfSpaceByQuery(param.spaceId(), param.query(), email);
    }
}
