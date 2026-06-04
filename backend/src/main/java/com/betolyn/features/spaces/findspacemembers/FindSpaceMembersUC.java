package com.betolyn.features.spaces.findspacemembers;

import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.spaces.SpaceUsersEntity;
import com.betolyn.features.spaces.SpaceUsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindSpaceMembersUC implements IUseCase<FindSpaceMembersParams, List<SpaceUsersEntity>> {
    private final SpaceUsersRepository spaceUsersRepository;

    public List<SpaceUsersEntity> findAllBySpaceId(FindSpaceMembersParams param) {
        return spaceUsersRepository.findAllBySpaceId(param.spaceId());
    }

    public List<SpaceUsersEntity> findAllBySpaceIdAndUserNames(FindSpaceMembersParams param) {
        return spaceUsersRepository.findAllBySpaceIdAndUserNames(param.spaceId(), param.username());
    }

    @Override
    public List<SpaceUsersEntity> execute(FindSpaceMembersParams param) {
        if (param.username() == null || param.username().isEmpty()) {
            return this.findAllBySpaceId(param);
        }

        return this.findAllBySpaceIdAndUserNames(param);
    }
}
