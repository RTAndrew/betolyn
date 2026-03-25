package com.betolyn.features.spaces.findspacebyid;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCase;
import com.betolyn.features.spaces.SpaceEntity;
import com.betolyn.features.spaces.SpaceRepository;
import com.betolyn.features.spaces.exceptions.SpaceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindSpaceByIdUC implements IUseCase<String, SpaceEntity> {
    private final SpaceRepository spaceRepository;

    @Override
    public SpaceEntity execute(String spaceId) throws SpaceNotFoundException {
        return spaceRepository.findById(spaceId).orElseThrow(SpaceNotFoundException::new);
    }
}
