package com.betolyn.features.spaces.findallspaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.betolyn.features.IUseCaseNoParams;
import com.betolyn.features.spaces.SpaceEntity;
import com.betolyn.features.spaces.SpaceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FindAllSpacesUC implements IUseCaseNoParams<List<SpaceEntity>> {
    private final SpaceRepository spaceRepository;

    @Override
    public List<SpaceEntity> execute() {
        return spaceRepository.findAll();
    }
}
